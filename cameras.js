import { Mat4 } from "./math/mat4.js";
import { Vec4 } from "./math/vec4.js";

export const cameras = [
    {
        name: "positive",
        id: "positive-camera",
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 135,
                    unit: "degrees",
                    direction: "counterclockwise",
                    axis: "Y"
                },
                {
                    operation: "rotate",
                    angle: 45,
                    unit: "degrees",
                    direction: "clockwise",
                    axis: "X"
                },
                {
                    operation: "translate",
                    x: 1.5,
                    y: 1.5,
                    z: 1.5
                }
            ]
        }),
        focalLength: 2.0,
        fieldOfView: 60.0
    },
    {
        name: "front",
        id: "front-camera",
        transform: new Mat4({
            T: new Vec4(0, 0, -1, 1)
        }),
        focalLength: 2.0,
        fieldOfView: 60.0
    },
    {
        name: "right",
        id: "right-camera",
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 90,
                    unit: "degrees",
                    direction: "counterclockwise",
                    axis: "Y"
                },
                {
                    operation: "translate",
                    x: 1,
                    y: 0,
                    z: 0
                }
            ]
        }),
        focalLength: 2.0,
        fieldOfView: 60.0
    },
    {
        name: "top",
        id: "top-camera",
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
                    y: 1,
                    z: 0
                }
            ]
        }),
        focalLength: 2.0,
        fieldOfView: 60.0
    }
];














