import {Shape} from "./shape.js";
import {Ray} from "../math/ray.js";
import { discriminant } from "../utils.js"
import {Vec3} from "../math/vec3.js";

export class Cylinder extends Shape {
    constructor(props = {}) {
        super({...props, type: "cylinder"});

        this.radius = 0.25;
        this.height = 0.5;

        if (props.radius) this.radius = props.radius;
        if (props.height) this.height = props.height;
    }

    hit_test(ray) {
        const localRay = new Ray(
            this.inverseTransform.times(ray.origin),
            this.inverseTransform.times(ray.direction)
        );

        const upperPlaneT = (this.height / 2 - localRay.origin.y) / localRay.direction.y;
        const upperPlanePoint = localRay.at(upperPlaneT);

        const upperPointValid = upperPlaneT >= 0 &&
            Math.pow(upperPlanePoint.x, 2) +
            Math.pow(upperPlanePoint.z, 2)
            <= Math.pow(this.radius, 2);

        const lowerPlaneT = (-this.height / 2 - localRay.origin.y) / localRay.direction.y;
        const lowerPlanePoint = localRay.at(lowerPlaneT);

        const lowerPointValid = lowerPlaneT >= 0 &&
            Math.pow(lowerPlanePoint.x, 2) +
            Math.pow(lowerPlanePoint.z, 2)
            <= Math.pow(this.radius, 2);

        const a = Math.pow(localRay.direction.x, 2) + Math.pow(localRay.direction.z, 2);
        const b = 2 * (localRay.origin.x * localRay.direction.x + localRay.origin.z * localRay.direction.z);
        const c = Math.pow(localRay.origin.x, 2) + Math.pow(localRay.origin.z, 2) - Math.pow(this.radius, 2);

        const d = discriminant(a, b, c);

        let mainSurfaceT1 = null;
        let mainSurfaceT2 = null;

        if (d >= 0) {
            mainSurfaceT1 = (-b - Math.sqrt(d)) / (2 * a);
            mainSurfaceT2 = (-b + Math.sqrt(d)) / (2 * a);
        }

        let mainPoint1Valid = false;
        let mainPoint2Valid = false;

        let mainPoint1 = null;
        let mainPoint2 = null;

        if (mainSurfaceT1) {
            mainPoint1 = localRay.at(mainSurfaceT1);
            mainPoint1Valid = mainSurfaceT1 >= 0 &&
                mainPoint1.y >= - this.height / 2 &&
                mainPoint1.y <= this.height / 2;
        }

        if (mainSurfaceT2) {
            mainPoint2 = localRay.at(mainSurfaceT2);
            mainPoint2Valid = mainSurfaceT2 >= 0 &&
                mainPoint2.y >= - this.height / 2 &&
                mainPoint2.y <= this.height / 2;
        }

        const options = [
            {
                surface: "top",
                t: upperPlaneT,
                valid: upperPointValid
            },
            {
                surface: "bottom",
                t: lowerPlaneT,
                valid: lowerPointValid
            },
            {
                surface: "main",
                t: mainSurfaceT1,
                valid: mainPoint1Valid
            },
            {
                surface: "main",
                t: mainSurfaceT2,
                valid: mainPoint2Valid
            }
        ];

        let min_t = Infinity;
        let hit_record = null;

        for (const option of options) {
            if (option.valid && option.t < min_t) {
                min_t = option.t;
                hit_record = option;
            }
        }

        return hit_record;
    }

    surface_normal(hit_record) {
        const localPoint = this.inverseTransform.times(hit_record.point);

        let N;
        switch (hit_record.surface) {
            case "top": N = new Vec3(0, 1, 0); break;
            case "bottom": N = new Vec3(0, -1, 0); break;
            case "main": N = new Vec3(localPoint.x, 0, localPoint.z); break;
        }

        return this.transform.times(N);
    }

    toJSON() {
        return {...this, className: "Cylinder"};
    }

    static fromJSON(inObj) {
        const outObj = new Cylinder();
        for (const propName in inObj) {
            outObj[propName] = inObj[propName];
        }
        return outObj;
    }
}






