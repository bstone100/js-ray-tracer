import { views } from "./views.js";
import { scene } from "./scenes/primitives.js";

const samplesPerPixel = 10;
const maxBounces = 10;

const canvasWidthPixels = 1024;
const canvasHeightPixels = 1024;

const view = views[0];
const canvas = view.canvas;
canvas.width = canvasWidthPixels;
canvas.height = canvasHeightPixels;
const canvasContext = canvas.getContext("2d");

const tileWidthPixels = 64;
const tileHeightPixels = 64;

// assume for now these are divisible
const canvasWidthTiles = canvasWidthPixels / tileWidthPixels; // 64
const canvasHeightTiles = canvasHeightPixels / tileHeightPixels; // 64

const workerPoolSize = 8;

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
            }
        }
    });

    workers.push({
        worker,
        working: assignWork(worker)
    });
}

const startButton = document.querySelector("#startButton");

startButton.addEventListener("click", () => {

});








