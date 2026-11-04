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
import { cameras } from "./cameras.js";
import * as primitives from "./scenes/primitives.js";
import * as axes from "./scenes/axes.js";

self.addEventListener("message", (event) => {

    if (event.data.type === "processTile") {

        // these are the ray tracing arguments passed by the main thread
        // note that postMessage strips classes into plain objects

        const {
            cameraId,
            topLeft,
            tileSize,
            canvasSize,
            samplesPerPixel,
            maxBounces,
            sceneId
        } = event.data;

        const camera = cameras.find(c => c.id === cameraId);

        let scene;
        if (sceneId === "primitives") {
            scene = primitives.scene;
        } else if (sceneId === "axes") {
            scene = axes.scene;
        }

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










