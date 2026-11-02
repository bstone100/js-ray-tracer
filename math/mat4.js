import { Vec4 } from "./vec4.js";

// column major
export class Mat4 {
    constructor() {
        // make identity matrix

        // 1 0 0 0
        // 0 1 0 0
        // 0 0 1 0
        // 0 0 0 1

        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    get right() {
        return new Vec4(
            this.m[0][0],
            this.m[1][0],
            this.m[2][0],
            this.m[3][0]
        );
    }

    get X() {
        return this.right;
    }

    get up() {
        return new Vec4(
            this.m[0][1],
            this.m[1][1],
            this.m[2][1],
            this.m[3][1]
        );
    }

    get Y() {
        return this.up;
    }

    get front() {
        return new Vec4(
            this.m[0][2],
            this.m[1][2],
            this.m[2][2],
            this.m[3][2]
        );
    }

    get Z() {
        return this.front;
    }

    get translation() {
        return new Vec4(
            this.m[0][3],
            this.m[1][3],
            this.m[2][3],
            this.m[3][3]
        );
    }

    set translation(vec4) {
        this.m[0][3] = vec4.x;
        this.m[1][3] = vec4.y;
        this.m[2][3] = vec4.z;
    }

    get T() {
        return this.translation;
    }

    translate(vec4) {
        this.translation = this.translation.plus(vec4);
    }
}









