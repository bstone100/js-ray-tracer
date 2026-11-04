import { Mat4 } from "../math/mat4.js";
import { Vec4 } from "../math/vec4.js";
import {Color} from "../math/color.js";
import {Cylinder} from "../shapes/cylinder.js";
import {Lambertian} from "../materials/lambertian.js";
import {Cone} from "../shapes/cone.js";

// axes made of cylinders and cones
// should turn it into a factory to produce axis models
export const scene = [
    new Cylinder({
        name: "yAxisCylinder",
        transform: new Mat4({
            T: new Vec4(0, 0.5, 0, 1)
        }),
        material: new Lambertian({
            color: new Color(0, 255, 0, 255)
        }),
        radius: 0.01,
        height: 1
    }),
    new Cone({
        name: "yAxisCone",
        transform: new Mat4({
            T: new Vec4(0, 1.025, 0, 1)
        }),
        material: new Lambertian({
            color: new Color(0, 255, 0, 255)
        }),
        radius: 0.02,
        height: 0.05
    }),
    new Cylinder({
        name: "xAxisCylinder",
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
        material: new Lambertian({
            color: new Color(255, 0, 0, 255)
        }),
        radius: 0.01,
        height: 1
    }),
    new Cone({
        name: "xAxisCone",
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
        material: new Lambertian({
            color: new Color(255, 0, 0, 255)
        }),
        radius: 0.02,
        height: 0.05
    }),
    new Cylinder({
        name: "zAxisCylinder",
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
        material: new Lambertian({
            color: new Color(0, 0, 255, 255)
        }),
        radius: 0.01,
        height: 1
    }),
    new Cone({
        name: "zAxisCone",
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
        material: new Lambertian({
            color: new Color(0, 0, 255, 255)
        }),
        radius: 0.02,
        height: 0.05
    })
];
































