import { Vec4 } from "./vec4.js";

export class Vec3 extends Vec4 {
    constructor(x, y, z) {
        super(x, y, z, 0);
    }
}