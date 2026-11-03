import {Mat4} from "../math/mat4.js";
import {Color} from "../math/color.js";
import {randomColor} from "../utils.js";
import {Material} from "../materials/material.js";

export class Shape {
    constructor({type, name, transform, material} = {}) {
        // defaults
        this.type = "";
        this.name = "";
        this.transform = new Mat4();
        this.material = new Material();

        if (type) this.type = type;
        if (name) this.name = name;
        if (transform) this.transform = transform;
        if (material) this.material = material;
    }

    hit_test(ray) {}

    surface_normal(hit_record) {}
}







