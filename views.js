export const views = [
    {
        name: "front",
        id: "front-view",
        camera: {
            center: {
                x: 0,
                y: 0,
                z: -1
            },
            direction: {
                x: 0,
                y: 0,
                z: 1
            },
            transform: [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, -1],
                [0, 0, 0, 1]
            ],
            focalLength: 2.0,
            fieldOfView: 60.0
        }
    },
    {
        name: "right",
        id: "right-view",
        camera: {
            center: {
                x: 1,
                y: 0,
                z: 0
            },
            direction: {
                x: -1,
                y: 0,
                z: 0
            },
            transform: [
                [0, 0, -1, 1],
                [0, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 1]
            ],
            focalLength: 2.0,
            fieldOfView: 60.0
        }
    },
    {
        name: "top",
        id: "top-view",
        camera: {
            center: {
                x: 0,
                y: 1,
                z: 0
            },
            direction: {
                x: 0,
                y: -1,
                z: 0
            },
            transform: [
                [1, 0, 0, 0],
                [0, 0, -1, 1],
                [0, 1, 0, 0],
                [0, 0, 0, 1]
            ],
            focalLength: 2.0,
            fieldOfView: 60.0
        }
    }
];