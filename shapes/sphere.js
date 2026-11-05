import {Shape} from "./shape.js";
import {Ray} from "../math/ray.js";
import {discriminant} from "../utils.js";
import {Vec3} from "../math/vec3.js";

export class Sphere extends Shape {
    constructor(props = {}) {
        super({...props, type: "sphere"});

        this.radius = 0.25;

        if (props.radius) this.radius = props.radius;
    }

    hit_test(ray) {
        const localRay = new Ray(
            this.inverseTransform.times(ray.origin), // this could be precomputed because ray origin is the same for all rays
            this.inverseTransform.times(ray.direction)
        );

        const a = localRay.direction.dot(localRay.direction);
        const b = 2 * localRay.origin.dot(localRay.direction);
        const c = localRay.origin.dot(localRay.origin) - Math.pow(this.radius, 2);

        const d = discriminant(a, b, c);

        if (d >= 0) {
            const t1 = (-b - Math.sqrt(d)) / (2 * a);
            const t2 = (-b + Math.sqrt(d)) / (2 * a);

            if (t1 < 0 && t2 < 0) return null;
            if (t1 >= 0 && t2 < 0) return {t: t1};
            if (t1 < 0 && t2 >= 0) return {t: t2};
            return {t: Math.min(t1, t2)};
        }
        return null;
    }

    surface_normal(hit_record) {
        const localPoint = this.inverseTransform.times(hit_record.point);
        const N = new Vec3(localPoint.x, localPoint.y, localPoint.z);
        return this.transform.times(N);
    }

    toJSON() {
        return {...this, className: "Sphere"};
    }

    static fromJSON(inObj) {
        const outObj = new Sphere();
        for (const propName in inObj) {
            outObj[propName] = inObj[propName];
        }
        return outObj;
    }
}

















