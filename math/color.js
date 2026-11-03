import { Vec4 } from "./vec4.js";

export class Color extends Vec4 {
    constructor(r, g, b, a) {
        super(r, g, b, a);
    }

    get r() {
        return this.x;
    }

    get g() {
        return this.y;
    }

    get b() {
        return this.z;
    }

    get a() {
        return this.w;
    }
}