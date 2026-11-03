import { Vec4 } from "./vec4.js"

export class Point3 extends Vec4 {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z, 1);
    }
}