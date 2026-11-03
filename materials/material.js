import {Color} from "../math/color.js";

export class Material {
    constructor({type, color} = {}) {
        this.type = "";
        this.color = new Color();

        if (type) {
            this.type = type;
        }
        if (color) {
            this.color = color;
        }
    }

    get albedo() {
        return this.color.dividedBy(255);
    }

    scatter(incomingRay, hitPoint, surfaceNormal) {}
}