
// axes made of cylinders and cones
// wait we can't do this yet because the cylinder intersection code doesn't handle rotation
export const scene = [
    {
        name: "yAxisCylinder",
        type: "cylinder",
        height: 1,
        radius: 0.01,
        center: {
            x: 0,
            y: 0.5,
            z: 0
        },
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
        center: {
            x: 0,
            y: 1.025,
            z: 0
        },
        color: {
            r: 0,
            g: 255,
            b: 0,
            a: 255
        },
        material: "diffuse"
    }
];