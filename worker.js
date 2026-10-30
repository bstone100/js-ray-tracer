import {
    randomLocationInsideCanvasPixelToWorldSpace,
    getColorAtRayHitPoint,
    getViewportSizeFromCamera
} from "./utils.js";

self.addEventListener("message", (event) => {

    if (event.data.type === "processTile") {

        // these are the ray tracing arguments passed by the main thread
        const topLeft = event.data.topLeft;
        const tileWidth = event.data.width;
        const tileHeight = event.data.height;
        const samplesPerPixel = event.data.samplesPerPixel;
        const maxBounces = event.data.maxBounces;
        const canvasSize = event.data.canvasSize;
        const camera = event.data.camera;
        const scene = event.data.scene

        const imageData = new ImageData(tileWidth, tileHeight);

        for (let canvasY = topLeft.y; canvasY < topLeft.y + tileHeight; canvasY++) {
            for (let canvasX = topLeft.x; canvasX < topLeft.x + tileWidth; canvasX++) {
                const totalColor = {
                    r: 0,
                    g: 0,
                    b: 0
                };
                for (let sample = 0; sample < samplesPerPixel; sample++) {
                    // do ray tracing here

                    const rayTarget = randomLocationInsideCanvasPixelToWorldSpace({x: canvasX, y: canvasY},
                        canvasSize,
                        getViewportSizeFromCamera(camera),
                        camera);

                    const ray = {
                        origin: camera.center,
                        direction: rayTarget
                    };

                    const color = getColorAtRayHitPoint(ray, scene, maxBounces, 0);

                    totalColor.r += color.r;
                    totalColor.g += color.g;
                    totalColor.b += color.b;
                }
                const averageColor = {
                    r: totalColor.r / samplesPerPixel,
                    g: totalColor.g / samplesPerPixel,
                    b: totalColor.b / samplesPerPixel,
                    a: 255
                };

                // write the color into the buffer
                // topLeft in canvas space is 0,0 in the buffer
                // (x,y) to array offset is 4(y * width + x), with x and y in tile space

                const offset = 4 * ((canvasY - topLeft.y) * tileWidth + (canvasX - topLeft.x));
                imageData.data[offset] = averageColor.r;
                imageData.data[offset + 1] = averageColor.g;
                imageData.data[offset + 2] = averageColor.b;
                imageData.data[offset + 3] = averageColor.a;
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










