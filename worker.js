import {
    randomLocationInsideCanvasPixelToWorldSpace,
    getColorAtRayHitPoint,
    getViewportSizeFromCamera
} from "./utils.js";
import {Color} from "./math/color.js";
import {Point2} from "./math/point2.js";
import {Size2} from "./math/size2.js";
import {Mat4} from "./math/mat4.js";
import {Vec3} from "./math/vec3.js";
import {Ray} from "./math/ray.js";
import {Box} from "./shapes/box.js";
import {Sphere} from "./shapes/sphere.js";
import {Cone} from "./shapes/cone.js";
import {Cylinder} from "./shapes/cylinder.js";
import {Lambertian} from "./materials/lambertian.js";
import {Metal} from "./materials/metal.js";

self.addEventListener("message", (event) => {

    if (event.data.type === "processTile") {

        // these are the ray tracing arguments passed by the main thread
        // note that postMessage strips classes into plain objects

        const {
            cameraJSON,
            topLeft,
            tileSize,
            canvasSize,
            samplesPerPixel,
            maxBounces,
            sceneJSON
        } = event.data;

        // the scene was passed through as a plain object, so let's reconstruct the class instances
        // but carefully, without duplicating memory

        function reviveJSON(key, value) {
            switch (value.className) {
                case "Mat4": return Mat4.fromJSON(value);
                case "Box": return Box.fromJSON(value);
                case "Sphere": return Sphere.fromJSON(value);
                case "Cone": return Cone.fromJSON(value);
                case "Cylinder": return Cylinder.fromJSON(value);
                case "Color": return Color.fromJSON(value);
                case "Lambertian": return Lambertian.fromJSON(value);
                case "Metal": return Metal.fromJSON(value);
            }
            return value;
        }

        // this should fully revive scene with class instances
        const scene = JSON.parse(sceneJSON, reviveJSON);

        // should do the same thing for cameras
        const camera = JSON.parse(cameraJSON, reviveJSON);

        const imageData = new ImageData(tileSize.width, tileSize.height);

        for (let canvasY = topLeft.y; canvasY < topLeft.y + tileSize.height; canvasY++) {
            for (let canvasX = topLeft.x; canvasX < topLeft.x + tileSize.width; canvasX++) {
                let totalColor = new Color(0, 0, 0, 0);
                for (let sample = 0; sample < samplesPerPixel; sample++) {
                    // do ray tracing here

                    // Point3
                    const rayTarget = randomLocationInsideCanvasPixelToWorldSpace(new Point2(canvasX, canvasY),
                                                                                canvasSize,
                                                                                getViewportSizeFromCamera(camera),
                                                                                camera);

                    const ray = new Ray(camera.transform.translation, rayTarget);

                    const color = getColorAtRayHitPoint(ray, scene, maxBounces, 0);

                    totalColor = totalColor.plus(color);
                }

                const averageColor = totalColor.dividedBy(samplesPerPixel);

                const offset = 4 * ((canvasY - topLeft.y) * tileSize.width + (canvasX - topLeft.x));
                imageData.data[offset] = averageColor.r;
                imageData.data[offset + 1] = averageColor.g;
                imageData.data[offset + 2] = averageColor.b;
                imageData.data[offset + 3] = 255;
            }
        }

        // now imageData is all filled up
        // time to notify the main thread and transfer ownership of the buffer to the main thread

        self.postMessage({
            type: "processTileFinished",
            imageData,
            topLeft
        }, {
            transfer: [imageData.data.buffer] // we have to transfer the ArrayBuffer since it is one of the transferable types
        });
    }
});










