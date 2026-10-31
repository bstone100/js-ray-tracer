import { views } from "./views.js";
import { scene } from "./scenes/primitives.js";

function renderView(view, canvas, params) {
    return new Promise((resolve) => {

        const {
            canvasSize,
            samplesPerPixel,
            maxBounces,
            tileSize,
            workerPoolSize,
            maxCanvasSize
        } = params;



        // return a new ImageData object
        // imageData is a tile
        function scaleImageData(imageData) {
            // assume the same aspect ratio

            const horizontalScale = maxCanvasSize.width / canvasSize.width;
            const verticalScale = maxCanvasSize.height / canvasSize.height;

            // we're scaling a tile not the whole image
            // if this tile is 64x64 in canvas space, then it will be a 512x512 tile in the scaled imaged
            const scaledImageData = new ImageData(imageData.width * horizontalScale, imageData.height * verticalScale);

            // go through every pixel in imageData
            // for each pixel in imageData, set a whole region (tile) of scaledImageData to be that color


            for (let originalY = 0; originalY < imageData.height; originalY++) {
                for (let originalX = 0; originalX < imageData.width; originalX++) {
                    const offset = 4 * (originalY * imageData.width + originalX);

                    const color = {
                        r: imageData.data[offset],
                        g: imageData.data[offset + 1],
                        b: imageData.data[offset + 2],
                        a: imageData.data[offset + 3]
                    };

                    // now scale this color to a whole region
                    // where is top left in the scaled image
                    const topLeft = {
                        x: originalX * horizontalScale,
                        y: originalY * verticalScale
                    };

                    // the size of the region is the two scales
                    for (let scaledY = topLeft.y; scaledY < topLeft.y + verticalScale; scaledY++) {
                        for (let scaledX = topLeft.x; scaledX < topLeft.x + horizontalScale; scaledX++) {
                            // paint the whole region with this color

                            const scaledOffset = 4 * (scaledY * scaledImageData.width + scaledX);

                            scaledImageData.data[scaledOffset] = color.r;
                            scaledImageData.data[scaledOffset + 1] = color.g;
                            scaledImageData.data[scaledOffset + 2] = color.b;
                            scaledImageData.data[scaledOffset + 3] = color.a;
                        }
                    }

                }
            }

            return scaledImageData;
        }



        const canvasWidthPixels = canvasSize.width;
        const canvasHeightPixels = canvasSize.height;

        const canvasContext = canvas.getContext("2d");

        const tileWidthPixels = tileSize.width;
        const tileHeightPixels = tileSize.height;

        // assume for now these are divisible
        const canvasWidthTiles = canvasWidthPixels / tileWidthPixels;
        const canvasHeightTiles = canvasHeightPixels / tileHeightPixels;

        // the x and y are in "tile" space
        let currentTile = {
            x: 0,
            y: 0
        };

        // let's assume for now that canvasWidth is divisible by tileWidth and canvasHeight is divisible by tileHeight
        function incrementCurrentTile() {
            if (currentTile.x < canvasWidthTiles - 1) {
                currentTile.x++;
            } else {
                currentTile.y++;
                currentTile.x = 0;
            }
        }

        function isCurrentTileValid() {
            return currentTile.x < canvasWidthTiles && currentTile.y < canvasHeightTiles;
        }

        function assignWork(worker) {
            if (isCurrentTileValid()) {

                worker.postMessage({
                    type: "processTile",
                    // in canvas space
                    topLeft: {
                        x: currentTile.x * tileWidthPixels,
                        y: currentTile.y * tileHeightPixels
                    },
                    width: tileWidthPixels,
                    height: tileHeightPixels,
                    samplesPerPixel,
                    maxBounces,
                    canvasSize: {
                        width: canvasWidthPixels,
                        height: canvasHeightPixels
                    },
                    camera: view.camera,
                    scene
                });

                incrementCurrentTile();
                return true;
            }
            return false;
        }

        // we're done when all workers are idle and there is no more work

        // spawn workers (threads)
        const workers = [];

        function isAllWorkDone() {
            for (const worker of workers) {
                if (worker.working) return false;
            }

            return !isCurrentTileValid();
        }

        const startTime = performance.now();

        for (let i = 0; i < workerPoolSize; i++) {
            const worker = new Worker("./worker.js", {type: "module"});

            worker.addEventListener("message", (event) => {
                if (event.data.type === "processTileFinished") {

                    // update the screen
                    // let's change this such that the canvas html dimensions are always the max dimensions
                    // but the canvas virtual dimensions can be smaller
                    // we'll just fill the max buffer using the virtual dimensions scaled up

                    // so our worker has just returned to us a non-scaled ImageData object
                    const imageData = event.data.imageData;

                    // let's scale it
                    const scaledImageData = scaleImageData(imageData);

                    // now we can put the scaled image data into the canvas
                    // we need to scale the top left coordinate as well

                    const topLeft = event.data.topLeft;

                    const horizontalScale = maxCanvasSize.width / canvasSize.width;
                    const verticalScale = maxCanvasSize.height / canvasSize.height;

                    const scaledTopLeft = {
                        x: topLeft.x * horizontalScale,
                        y: topLeft.y * verticalScale
                    };

                    canvasContext.putImageData(scaledImageData, scaledTopLeft.x, scaledTopLeft.y);

                    // now we can give the worker a new tile
                    workers[i].working = assignWork(worker);

                    if (isAllWorkDone()) {
                        const duration = performance.now() - startTime;
                        console.log("DONE");
                        console.log(`the work took ${duration / 1000}s to complete`);
                        resolve(duration);
                    }
                }
            });

            workers.push({
                worker,
                working: assignWork(worker)
            });
        }
    });
}

// when the user clicks on the button to render a view, we grab the ray tracing parameters from the inputs
// then we call renderView with the correct view and parameters

// grab the render buttons
// add click callbacks



// save settings to local storage when they change

const params = [
    "canvasSize",
    "samplesPerPixel",
    "maxBounces",
    "tileSize",
    "workerPoolSize"
];

// save values to local storage when they change
for (const param of params) {
    const selectElement = document.getElementById(param);

    selectElement.addEventListener("change", () => {
        localStorage.setItem(param, selectElement.value);
    });
}

// load values from local storage and set the active option in the select
function loadParams() {
    for (const param of params) {
        const value = localStorage.getItem(param);
        if (value) {
            const selectElement = document.getElementById(param);
            selectElement.value = value;
        }
    }
}

// get the values from the select elements and build an object
function getCurrentParams() {
    const obj = {};

    for (const param of params) {
        const selectElement = document.getElementById(param);
        obj[param] = Number.parseInt(selectElement.value, 10);
    }

    return obj;
}

function getMaxCanvasSize() {
    const selectElement = document.getElementById("canvasSize");
    const optionElement = selectElement.options[selectElement.options.length - 1];

    const size = Number.parseInt(optionElement.value, 10);

    return {
        width: size,
        height: size
    };
}

loadParams();

const viewDivs = document.querySelectorAll(".view");

const maxCanvasSize = getMaxCanvasSize();

for (const viewDiv of viewDivs) {
    const renderButton = viewDiv.querySelector(".renderButton");
    const canvas = viewDiv.querySelector("canvas");
    const durationElement = viewDiv.querySelector(".duration");

    const view = views.find((view) => view.id === viewDiv.dataset.viewId);

    // these properties should only be set once per <canvas>
    // then, we'll scale images up to fill the max size
    canvas.width = maxCanvasSize.width;
    canvas.height = maxCanvasSize.height;

    renderButton.addEventListener("click", async () => {

        // for clarity I want all size objects to have a width and height property
        // likewise I want all pos objects to have an x and y property
        const currentParams = getCurrentParams();
        const params = {
            ...currentParams,
            canvasSize: {
                width: currentParams.canvasSize,
                height: currentParams.canvasSize
            },
            tileSize: {
                width: currentParams.tileSize,
                height: currentParams.tileSize
            },
            maxCanvasSize
        };

        const duration = await renderView(view, canvas, params);
        durationElement.hidden = false;
        durationElement.textContent = (duration / 1000).toFixed(2);
    });
}

























