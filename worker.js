// a worker is going to ray trace a part of an image

// main script is going to assign part of an image to the worker
// worker is going to ray trace that part and return the final pixels to the main script which will then update the screen

self.addEventListener("message", (event) => {

    // event.data will have packed the info we need


    // main script is telling us to start ray tracing part of an image

    // ray trace here

    // now notify main that we're done, and transfer the pixel color raw data to main
    //
    // const width = 10;
    // const height = 10;
    // const imageData = new ImageData(width, height);
    //
    // self.postMessage(imageData, {transfer: [imageData.data.buffer]});



    // just test responding to the main thread
    // event.data should be an object with members type, val1, val2

    if (event.data.type === "processTile") {
        // main thread has just assigned us a tile that we need to process

        const tile = event.data.tile;

        // simulate work

        console.log(`starting to process tile ${tile}`);

        setTimeout(() => {
            self.postMessage({
                type: "processTileFinished",
                tile
            });
        }, 3000);
    }

});
