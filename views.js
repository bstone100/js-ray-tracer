const root2over2 = Math.sqrt(2) / 2;
const root3over3 = Math.sqrt(3) / 3;

export const views = [
    // {
    //     name: "positive",
    //     id: "positive-view",
    //     camera: {
    //         center: {
    //             x: 2,
    //             y: 2,
    //             z: 2
    //         },
    //         transform: [
    //             [-root2over2, -root3over3, -root3over3, 2],
    //             [0, root3over3, -root3over3, 2],
    //             [root2over2, -root3over3, -root3over3, 2],
    //             [0, 0, 0, 1]
    //         ]
    //     },
    //     focalLength: 2.0,
    //     fieldOfView: 60.0
    // },
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