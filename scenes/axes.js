import { Mat4 } from "../math/mat4.js";
import { Vec4 } from "../math/vec4.js";

// axes made of cylinders and cones
// should turn it into a factory to produce axis models
export const scene = [
    {
        name: "yAxisCylinder",
        type: "cylinder",
        height: 1,
        radius: 0.01,
        transform: new Mat4({
            T: new Vec4(0, 0.5, 0, 1)
        }),
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
        transform: new Mat4({
            T: new Vec4(0, 1.025, 0, 1)
        }),
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
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 90,
                    unit: "degrees",
                    direction: "counterclockwise",
                    axis: "Z"
                },
                {
                    operation: "translate",
                    x: 0.5,
                    y: 0,
                    z: 0
                }
            ]
        }),
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
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 90,
                    unit: "degrees",
                    direction: "counterclockwise",
                    axis: "Z"
                },
                {
                    operation: "translate",
                    x: 1.025,
                    y: 0,
                    z: 0
                }
            ]
        }),
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
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 90,
                    unit: "degrees",
                    direction: "clockwise",
                    axis: "X"
                },
                {
                    operation: "translate",
                    x: 0,
                    y: 0,
                    z: 0.5
                }
            ]
        }),
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
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 90,
                    unit: "degrees",
                    direction: "clockwise",
                    axis: "X"
                },
                {
                    operation: "translate",
                    x: 0,
                    y: 0,
                    z: 1.025
                }
            ]
        }),
        color: {
            r: 0,
            g: 0,
            b: 255,
            a: 255
        },
        material: "diffuse"
    }
];
































