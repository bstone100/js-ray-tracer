import { Vec4 } from "./vec4.js";

export class Point2 extends Vec4 {
    constructor(x = 0, y = 0) {
        super(x, y, 0, 0);
    }
}