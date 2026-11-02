// axes made of cylinders and cones
// should turn it into a factory to produce axis models
export const scene = [
    {
        name: "yAxisCylinder",
        type: "cylinder",
        height: 1,
        radius: 0.01,
        transform: [
            [1, 0, 0, 0],
            [0, 1, 0, 0.5],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        color: {
            r: 0,
            g: 255,
            b: 0,
            a: 255
        },
        material: "diffuse"
    },
    {
        name: "yAxisCone",
        type: "cone",
        height: .05,
        radius: 0.02,
        transform: [
            [1, 0, 0, 0],
            [0, 1, 0, 1.025],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        color: {
            r: 0,
            g: 255,
            b: 0,
            a: 255
        },
        material: "diffuse"
    },
    {
        name: "xAxisCylinder",
        type: "cylinder",
        height: 1,
        radius: 0.01,
        transform: [
            [0, 1, 0, 0.5],
            [-1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        color: {
            r: 255,
            g: 0,
            b: 0,
            a: 255
        },
        material: "diffuse"
    },
    {
        name: "xAxisCone",
        type: "cone",
        height: 0.05,
        radius: 0.02,
        transform: [
            [0, 1, 0, 1.025],
            [-1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        color: {
            r: 255,
            g: 0,
            b: 0,
            a: 255
        },
        material: "diffuse"
    },
    {
        name: "zAxisCylinder",
        type: "cylinder",
        height: 1,
        radius: 0.01,
        transform: [
            [1, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 1, 0, 0.5],
            [0, 0, 0, 1]
        ],
        color: {
            r: 0,
            g: 0,
            b: 255,
            a: 255
        },
        material: "diffuse"
    },
    {
        name: "zAxisCone",
        type: "cone",
        height: 0.05,
        radius: 0.02,
        transform: [
            [1, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 1, 0, 1.025],
            [0, 0, 0, 1]
        ],
        color: {
            r: 0,
            g: 0,
            b: 255,
            a: 255
        },
        material: "diffuse"
    }
];
































