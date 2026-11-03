import {Shape} from "./shape.js";
import {Ray} from "../math/ray.js";
import {discriminant} from "../utils.js";
import {Vec3} from "../math/vec3.js";

export class Cone extends Shape {
    constructor(props = {}) {
        super({...props, type: "cone"});

        this.radius = 0.25;
        this.height = 0.5;

        if (props.radius) this.radius = props.radius;
        if (props.height) this.height = props.height;
    }

    hit_test(ray) {
        const worldToShape = this.transform.toInverse();

        const localRay = new Ray(
            worldToShape.times(ray.origin),
            worldToShape.times(ray.direction)
        );

        const k1 = Math.pow(this.radius, 2) / Math.pow(this.height, 2);
        const k2 = this.height - localRay.origin.y - this.height / 2;

        const a = Math.pow(localRay.direction.x, 2) + Math.pow(localRay.direction.z, 2) - Math.pow(localRay.direction.y, 2) * k1;
        const b = 2 * (localRay.origin.x * localRay.direction.x + localRay.origin.z * localRay.direction.z + localRay.direction.y * k2 * k1);
        const c = Math.pow(localRay.origin.x, 2) + Math.pow(localRay.origin.z, 2) - k1 * Math.pow(k2, 2);

        const d = discriminant(a, b, c);

        let mainT1 = null;
        let mainT2 = null;

        let mainPoint1 = null;
        let mainPoint2 = null;

        let main1Valid = false;
        let main2Valid = false;

        if (d >= 0) {
            mainT1 = (-b - Math.sqrt(d)) / (2 * a);
            mainT2 = (-b + Math.sqrt(d)) / (2 * a);

            mainPoint1 = localRay.at(mainT1);
            mainPoint2 = localRay.at(mainT2);

            main1Valid = mainT1 >= 0 &&
                mainPoint1.y >= - this.height / 2 &&
                mainPoint1.y <= this.height / 2;

            main2Valid = mainT2 >= 0 &&
                mainPoint2.y >= - this.height / 2 &&
                mainPoint2.y <= this.height / 2;
        }

        const bottomT = (-this.height / 2 - localRay.origin.y) / localRay.direction.y;
        const bottomPoint = localRay.at(bottomT);

        const bottomValid = bottomT >= 0 &&
            Math.pow(bottomPoint.x, 2) +
            Math.pow(bottomPoint.z, 2)
            <= Math.pow(this.radius, 2);

        const options = [
            {
                surface: "main",
                t: mainT1,
                valid: main1Valid
            },
            {
                surface: "main",
                t: mainT2,
                valid: main2Valid
            },
            {
                surface: "bottom",
                t: bottomT,
                valid: bottomValid
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
        const localPoint = this.transform.toInverse().times(hit_record.point);

        let N;
        switch (hit_record.surface) {
            case "bottom": N = new Vec3(0, -1, 0); break;
            case "main": N = new Vec3(
                localPoint.x,
                Math.pow(this.radius, 2) / Math.pow(this.height, 2) * (this.height - localPoint.y - this.height / 2),
                localPoint.z
            ); break;
        }

        return this.transform.times(N);
    }
}







