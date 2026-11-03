import {Point3} from "./point3.js";
import {Vec3} from "./vec3.js";

export class Ray {
    constructor(origin, direction) {
        this.origin = new Point3(origin.x, origin.y, origin.z);
        this.direction = new Vec3(direction.x, origin.y, origin.z);
    }

    at(t) {
        return this.origin.plus(this.direction.times(t));
    }
}