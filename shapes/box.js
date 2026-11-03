import {Shape} from "./shape.js";
import {Size3} from "../math/size3.js";
import {Point3} from "../math/point3.js";
import {Ray} from "../math/ray.js";
import {Vec3} from "../math/vec3.js";

export class Box extends Shape {
    constructor(props = {}) {
        super({...props, type: "box"});

        this.width = 0.5;
        this.height = 0.5;
        this.depth = 0.5;

        if (props.width) this.width = props.width;
        if (props.height) this.height = props.height;
        if (props.depth) this.depth = props.depth;
    }

    hit_test(ray) {
        const worldToShape = this.transform.toInverse();

        const localRay = new Ray(
            worldToShape.times(ray.origin),
            worldToShape.times(ray.direction)
        );

        const boxMin = new Point3(
            -this.width / 2,
            -this.height / 2,
            -this.depth / 2
        );

        const boxMax = new Point3(
            this.width / 2,
            this.height / 2,
            this.depth / 2
        );

        const options = [
            {
                surface: "left",
                t: (boxMin.x - localRay.origin.x) / localRay.direction.x
            },
            {
                surface: "right",
                t: (boxMax.x - localRay.origin.x) / localRay.direction.x
            },
            {
                surface: "bottom",
                t: (boxMin.y - localRay.origin.y) / localRay.direction.y
            },
            {
                surface: "top",
                t: (boxMax.y - localRay.origin.y) / localRay.direction.y
            },
            {
                surface: "back",
                t: (boxMin.z - localRay.origin.z) / localRay.direction.z
            },
            {
                surface: "front",
                t: (boxMax.z - localRay.origin.z) / localRay.direction.z
            }
        ];

        let min_t = Infinity;
        let hit_record = null;

        for (const option of options) {
            if (option.t >= 0 && option.t < min_t) {
                const p = localRay.at(option.t);

                if (option.surface === "left" || option.surface === "right") {
                    if (p.y >= boxMin.y &&
                        p.y <= boxMax.y &&
                        p.z >= boxMin.z &&
                        p.z <= boxMax.z)
                    {
                        min_t = option.t;
                        hit_record = option;
                    }
                } else if (option.surface === "top" || option.surface === "bottom") {
                    if (p.x >= boxMin.x &&
                        p.x <= boxMax.x &&
                        p.z >= boxMin.z &&
                        p.z <= boxMax.z)
                    {
                        min_t = option.t;
                        hit_record = option;
                    }
                } else if (option.surface === "front" || option.surface === "back") {
                    if (p.x >= boxMin.x &&
                        p.x <= boxMax.x &&
                        p.y >= boxMin.y &&
                        p.y <= boxMax.y)
                    {
                        min_t = option.t;
                        hit_record = option;
                    }
                }
            }
        }

        return hit_record;
    }

    surface_normal(hit_record) {
        let N;
        switch (hit_record.surface) {
            case "left": N = new Vec3(-1, 0, 0); break;
            case "right": N = new Vec3(1, 0, 0); break;
            case "bottom": N = new Vec3(0, -1, 0); break;
            case "top": N = new Vec3(0, 1, 0); break;
            case "back": N = new Vec3(0, 0, -1); break;
            case "front": N = new Vec3(0, 0, 1); break;
        }
        return this.transform.times(N);
    }
}












