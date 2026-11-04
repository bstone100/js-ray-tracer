import { randomColor } from "../utils.js";
import { Mat4 } from "../math/mat4";
import {Cylinder} from "../shapes/cylinder.js";
import {Lambertian} from "../materials/lambertian.js";
import {Metal} from "../materials/metal.js";
import {Cone} from "../shapes/cone.js";
import {Color} from "../math/color.js";

export const scene = [
    // {
    //     name: "s1",
    //     center: {
    //         x: -0.5,
    //         y: 0.5,
    //         z: 0.5
    //     },
    //     radius: 0.2,
    //     color: randomColor(),
    //     type: "sphere",
    //     material: "metal"
    // },
    // {
    //     name: "s2",
    //     center: {
    //         x: 0,
    //         y: 0,
    //         z: 0.25
    //     },
    //     radius: 0.15,
    //     color: randomColor(),
    //     type: "sphere",
    //     material: "metal"
    // },
    // {
    //     name: "s3",
    //     center: {
    //         x: 0.5,
    //         y: -0.5,
    //         z: 0.75
    //     },
    //     radius: 0.25,
    //     color: randomColor(),
    //     type: "sphere",
    //     material: "metal"
    // },
    // {
    //     name: "box1",
    //     center: {
    //         x: 0.5,
    //         y: 0.5,
    //         z: 1
    //     },
    //     width: 0.5,
    //     height: 0.5,
    //     depth: 0.5,
    //     color: randomColor(),
    //     type: "box",
    //     material: "diffuse"
    // },
    // {
    //     name: "box2",
    //     center: {
    //         x: -0.5,
    //         y: -0.5,
    //         z: 0
    //     },
    //     width: 0.5,
    //     height: 0.2,
    //     depth: 1.5,
    //     color: randomColor(),
    //     type: "box",
    //     material: "diffuse"
    // },
    new Cylinder({
        name: "cylinder1",
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 45,
                    unit: "degrees",
                    direction: "counterclockwise",
                    axis: "Z"
                },
                {
                    operation: "translate",
                    x: 0.5,
                    y: -0.5,
                    z: 0
                }
            ]
        }),
        material: new Metal({
            color: new Color(200, 200, 255, 255)
        }),
        radius: 0.25,
        height: 0.75,
    }),
    new Cylinder({
        name: "cylinder2",
        transform: new Mat4({
            transforms: [
                {
                    operation: "translate",
                    x: -0.5,
                    y: -0.5,
                    z: 0.75
                }
            ]
        }),
        material: new Metal({
            color: new Color(255, 200, 200, 255)
        }),
        radius: 0.5,
        height: 0.25,
    }),
    new Cone({
        name: "cone1",
        transform: new Mat4({
            transforms: [
                {
                    operation: "rotate",
                    angle: 30,
                    unit: "degrees",
                    direction: "clockwise",
                    axis: "X"
                },
                {
                    operation: "translate",
                    x: 0,
                    y: 0,
                    z: 0.25
                }
            ]
        }),
        material: new Lambertian({
            color: new Color(200, 255, 200, 255)
        }),
        radius: 0.2,
        height: 0.4,
    }),
    // this sphere will act as the floor, underneath the other spheres
    // {
    //     name: "floor",
    //     center: {
    //         x: 0,
    //         y: -100.5,
    //         z: 0
    //     },
    //     radius: 100,
    //     color: randomColor(),
    //     type: "sphere",
    //     material: "diffuse"
    // }
];