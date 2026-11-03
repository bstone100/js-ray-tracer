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

self.addEventListener("message", (event) => {

    if (event.data.type === "processTile") {

        // these are the ray tracing arguments passed by the main thread
        // postMessage serializes everything and strips class instances into plain objects so we need to rebuild them
        // I will come up with a cleaner solution

        const topLeft = new Point2(event.data.topLeft.x, event.data.topLeft.y);
        const tileSize = new Size2(event.data.tileSize.width, event.data.tileSize.height);
        const canvasSize = new Size2(event.data.canvasSize.width, event.data.canvasSize.height);
        const samplesPerPixel = event.data.samplesPerPixel;
        const maxBounces = event.data.maxBounces;
        const camera = event.data.camera;
        camera.transform = new Mat4({m: camera.transform.m}); // rebuild this internal class instance
        const scene = event.data.scene
        // rebuild the internal class instances
        // this is a temporary solution, I will come up with something better
        for (const obj of scene) {
            obj.transform = new Mat4({m: obj.transform.m})
        }

        const imageData = new ImageData(tileSize.width, tileSize.height);

        for (let canvasY = topLeft.y; canvasY < topLeft.y + tileSize.height; canvasY++) {
            for (let canvasX = topLeft.x; canvasX < topLeft.x + tileSize.width; canvasX++) {
                let totalColor = new Color(0, 0, 0);
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

                // write the color into the buffer
                // topLeft in canvas space is 0,0 in the buffer
                // (x,y) to array offset is 4(y * width + x), with x and y in tile space

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










