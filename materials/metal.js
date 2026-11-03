import {Material} from "./material.js";
import {Ray} from "../math/ray.js";

export class Metal extends Material {
    constructor(props = {}) {
        super({...props, type: "metal"});
    }

    scatter(incomingRay, hitPoint, surfaceNormal) {
        // this is a mirror reflection
        // R = v - 2(v • N)N, where v is incomingRay.direction, N is surfaceNormal

        const direction = incomingRay.direction.minus(surfaceNormal.times(2 * incomingRay.direction.dot(surfaceNormal)));

        return new Ray(
            hitPoint,
            direction.toUnit()
        );
    }
}









