import { views } from "./views.js";
import { scene } from "./scenes/primitives.js";

function renderView(view, params) {
    return new Promise((resolve) => {

        const {
            canvasSize,
                samplesPerPixel,
                maxBounces,
                tileSize,
                workerPoolSize
        } = params;

        console.log(params);

        const canvasWidthPixels = canvasSize;
        const canvasHeightPixels = canvasSize;

        const canvas = document.querySelector(`canvas[data-view-id="${view.id}"]`);
        canvas.width = canvasWidthPixels;
        canvas.height = canvasHeightPixels;
        const canvasContext = canvas.getContext("2d");

        const tileWidthPixels = tileSize;
        const tileHeightPixels = tileSize;

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

                    // this should update the screen
                    canvasContext.putImageData(event.data.imageData, event.data.topLeft.x, event.data.topLeft.y);

                    // now we can give the worker a new tile
                    workers[i].working = assignWork(worker);

                    if (isAllWorkDone()) {
                        const endTime = performance.now();
                        console.log("DONE");
                        console.log(`the work took ${(endTime - startTime) / 1000}s to complete`);
                        resolve();
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

const renderButtons = document.querySelectorAll(".renderButton");

const canvasSizeSelect = document.querySelector("#canvasSize");
const samplesPerPixelSelect = document.querySelector("#samplesPerPixel");
const maxBouncesSelect = document.querySelector("#maxBounces");
const tileSizeSelect = document.querySelector("#tileSize");
const workerPoolSizeSelect = document.querySelector("#workerPoolSize");

for (const renderButton of renderButtons) {
    renderButton.addEventListener("click", async () => {
        const viewId = renderButton.dataset.viewId;

        const view = views.find((view) => view.id === viewId);

        await renderView(view, {
            canvasSize: parseInt(canvasSizeSelect.value, 10),
            samplesPerPixel: parseInt(samplesPerPixelSelect.value, 10),
            maxBounces: parseInt(maxBouncesSelect.value, 10),
            tileSize: parseInt(tileSizeSelect.value, 10),
            workerPoolSize: parseInt(workerPoolSizeSelect.value, 10)
        });
    });
}

























