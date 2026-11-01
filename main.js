import { views } from "./views.js";
import { scene } from "./scenes/primitives.js";

function renderView(view, currentCanvas, params) {
    return new Promise((resolve) => {

        const {
            canvasSize,
            samplesPerPixel,
            maxBounces,
            tileSize,
            workerPoolSize
        } = params;

        const canvasWidthPixels = canvasSize.width;
        const canvasHeightPixels = canvasSize.height;

        // let's update the canvas dimensions here
        // if the dimensions have changed, we need to update the <canvas>, but this wipes the image data
        // so we need to first update the canvas dimensions or make a new canvas in the new dimensions and then paint it with the old image scaled up using context.drawImage which takes an HTMLCanvasElement as an argument
        // I'm going to first try making a new canvas and replacing the old one with it

        const newCanvas = document.createElement("canvas");

        // this guy gets the new dimensions
        newCanvas.width = canvasWidthPixels;
        newCanvas.height = canvasHeightPixels;

        // now paint the new canvas with the old canvas's content
        const newContext = newCanvas.getContext("2d");

        // this takes a snapshot of the old canvas, and then scales it to fit the new canvas
        newContext.drawImage(currentCanvas, 0, 0, canvasWidthPixels, canvasHeightPixels);

        // now we need to replace the old canvas with the new one
        currentCanvas.replaceWith(newCanvas);

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

                    // the worker has delivered to us an ImageData object
                    const imageData = event.data.imageData;
                    const topLeft = event.data.topLeft;

                    // update the screen
                    newContext.putImageData(imageData, topLeft.x, topLeft.y);

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

loadParams();

const viewDivs = document.querySelectorAll(".view");

for (const viewDiv of viewDivs) {
    const renderButton = viewDiv.querySelector(".renderButton");
    const initialCanvas = viewDiv.querySelector("canvas");
    const durationElement = viewDiv.querySelector(".duration");

    const view = views.find((view) => view.id === viewDiv.dataset.viewId);

    // set the initial canvas size
    const initialParams = getCurrentParams();
    initialCanvas.width = initialParams.canvasSize;
    initialCanvas.height = initialParams.canvasSize;

    renderButton.addEventListener("click", async () => {

        // since we're replacing the old one every time
        const currentCanvas = viewDiv.querySelector("canvas");

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
            }
        };

        const duration = await renderView(view, currentCanvas, params);
        durationElement.textContent = (duration / 1000).toFixed(2);
    });
}

























