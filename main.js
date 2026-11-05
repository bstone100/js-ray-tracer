import { Point2 } from "./math/point2.js";
import { Size2 } from "./math/size2.js";
import * as primitives from "./scenes/primitives.js";
import * as axes from "./scenes/axes.js";
import {cameras} from "./cameras.js";

// let's precompute the inverse matrices for the scenes

function computeInverseTransforms() {
    for (const scene of [primitives.scene, axes.scene]) {
        for (const obj of scene) {
            obj.inverseTransform = obj.transform.toInverse();
        }
    }
}

computeInverseTransforms();

function renderView(cameraId, currentCanvas, params) {
    return new Promise((resolve) => {

        const {
            canvasSize,
            samplesPerPixel,
            maxBounces,
            tileSize,
            workerPoolSize,
            sceneId
        } = params;

        const newCanvas = document.createElement("canvas");

        newCanvas.width = canvasSize.width;
        newCanvas.height = canvasSize.height;

        const newContext = newCanvas.getContext("2d");

        // this takes a snapshot of the old canvas, and then scales it to fit the new canvas
        newContext.drawImage(currentCanvas, 0, 0, canvasSize.width, canvasSize.height);

        currentCanvas.replaceWith(newCanvas);

        const canvasSizeTiles = new Size2(canvasSize.width / tileSize.width, canvasSize.height / tileSize.height);

        // the x and y are in "tile" space
        let currentTile = new Point2();

        // let's assume for now that canvasWidth is divisible by tileWidth and canvasHeight is divisible by tileHeight
        function incrementCurrentTile() {
            if (currentTile.x < canvasSizeTiles.width - 1) {
                currentTile.x++;
            } else {
                currentTile.y++;
                currentTile.x = 0;
            }
        }

        function isCurrentTileValid() {
            return currentTile.x < canvasSizeTiles.width && currentTile.y < canvasSizeTiles.height;
        }

        // we should actually build the scene just once here
        // build meaning compute the transform and inverse transform for each object
        // and then we'll need to deserialize it in the worker
        // but this can be a fast operation because the objects are intact
        // so we just need the classes to have a fromObj or fromJSON constructor

        let scene;
        if (sceneId === "primitives") {
            scene = primitives.scene;
        } else if (sceneId === "axes") {
            scene = axes.scene;
        }

        const sceneJSON = JSON.stringify(scene);

        let camera = cameras.find(c => c.id === cameraId);

        const cameraJSON = JSON.stringify(camera);

        // okay the transforms and inverse transforms are already built by now
        // the transforms are built when the modules are imported
        // the inverses we computed at the top

        function assignWork(worker) {
            if (isCurrentTileValid()) {

                // I want to use classes but postMessage strips classes into simple objects
                worker.postMessage({
                    type: "processTile",
                    cameraJSON,
                    topLeft: new Point2(currentTile.x * tileSize.width, currentTile.y * tileSize.height),
                    tileSize,
                    canvasSize,
                    samplesPerPixel,
                    maxBounces,
                    sceneJSON
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

        function terminateWorkers() {
            for (const w of workers) {
                w.worker.terminate();
            }
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
                        terminateWorkers();
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
    {key: "canvasSize", type: "number"},
    {key: "samplesPerPixel", type: "number"},
    {key: "maxBounces", type: "number"},
    {key: "tileSize", type: "number"},
    {key: "workerPoolSize", type: "number"},
    {key: "sceneId", type: "string"}
];

// save values to local storage when they change
for (const param of params) {
    const selectElement = document.getElementById(param.key);

    selectElement.addEventListener("change", () => {
        localStorage.setItem(param.key, selectElement.value);
    });
}

// load values from local storage and set the active option in the select
function loadParams() {
    for (const param of params) {
        const value = localStorage.getItem(param.key);
        if (value) {
            const selectElement = document.getElementById(param.key);
            selectElement.value = value;
        }
    }
}

// get the values from the select elements and build an object
function getCurrentParams() {
    const obj = {};

    for (const param of params) {
        const selectElement = document.getElementById(param.key);
        if (param.type === "number") {
            obj[param.key] = Number.parseInt(selectElement.value, 10);
        } else if (param.type === "string") {
            obj[param.key] = selectElement.value;
        }
    }

    return obj;
}

loadParams();

const cameraDivs = document.querySelectorAll(".camera");

for (const cameraDiv of cameraDivs) {
    const renderButton = cameraDiv.querySelector(".renderButton");
    const initialCanvas = cameraDiv.querySelector("canvas");
    const durationElement = cameraDiv.querySelector(".duration");

    const cameraId = cameraDiv.dataset.cameraId;

    // set the initial canvas size
    const initialParams = getCurrentParams();
    initialCanvas.width = initialParams.canvasSize;
    initialCanvas.height = initialParams.canvasSize;

    renderButton.addEventListener("click", async () => {

        // since we're replacing the old one every time
        const currentCanvas = cameraDiv.querySelector("canvas");

        const currentParams = getCurrentParams();
        const params = {
            ...currentParams,
            canvasSize: new Size2(currentParams.canvasSize, currentParams.canvasSize),
            tileSize: new Size2(currentParams.tileSize, currentParams.tileSize)
        };

        const duration = await renderView(cameraId, currentCanvas, params);
        durationElement.textContent = (duration / 1000).toFixed(2);
    });
}

























