import { Material } from "./material.js";
import {Ray} from "../math/ray.js";
import {Vec4} from "../math/vec4.js";

export class Lambertian extends Material {
    constructor(props = {}) {
        super({...props, type: "lambertian"});
    }

    scatter(incomingRay, hitPoint, surfaceNormal) {
        return new Ray(
            hitPoint,
            surfaceNormal.plus(Vec4.randomUnitVector()).toUnit()
        );
    }
}







