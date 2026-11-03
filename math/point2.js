import { Vec4 } from "./vec4.js";

export class Point2 extends Vec4 {
    constructor(x, y) {
        super(x, y, 0, 0);
    }
}