import { Vec4 } from "./vec4.js";

export class Color extends Vec4 {
    constructor(r, g, b, a) {
        super(r, g, b, a);
    }

    get r() {
        return this.x;
    }

    set r(val) {
        this.x = val;
    }

    get g() {
        return this.y;
    }

    set g(val) {
        this.y = val;
    }

    get b() {
        return this.z;
    }

    set b(val) {
        this.z = val;
    }

    get a() {
        return this.w;
    }

    set a(val) {
        this.w = val;
    }

    toJSON() {
        return {...this, className: "Color"};
    }

    static fromJSON(inObj) {
        const outObj = new Color();
        for (const propName in inObj) {
            outObj[propName] = inObj[propName];
        }
        return outObj;
    }
}