import { Vec4 } from "./vec4.js";
import { degreesToRadians } from "../utils.js";

// column major
export class Mat4 {
    constructor({X, Y, Z, T, A, B, C, D}) {
        // start with identity matrix
        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // X, Y, Z, T are columns
        // A, B, C, D are rows

        if (X) {
            this.X = X;
        }
        if (Y) {
            this.Y = Y;
        }
        if (Z) {
            this.Z = Z;
        }
        if (T) {
            this.T = T;
        }
        if (A) {
            this.A = A;
        }
        if (B) {
            this.B = B;
        }
        if (C) {
            this.C = C;
        }
        if (D) {
            this.D = D;
        }
    }

    get X() {
        return new Vec4(
            this.m[0][0],
            this.m[1][0],
            this.m[2][0],
            this.m[3][0]
        );
    }

    set X(vec4) {
        this.m[0][0] = vec4.x;
        this.m[1][0] = vec4.y;
        this.m[2][0] = vec4.z;
        this.m[3][0] = vec4.w;
    }

    get Y() {
        return new Vec4(
            this.m[0][1],
            this.m[1][1],
            this.m[2][1],
            this.m[3][1]
        );
    }

    set Y(vec4) {
        this.m[0][1] = vec4.x;
        this.m[1][1] = vec4.y;
        this.m[2][1] = vec4.z;
        this.m[3][1] = vec4.w;
    }

    get Z() {
        return new Vec4(
            this.m[0][2],
            this.m[1][2],
            this.m[2][2],
            this.m[3][2]
        );
    }

    set Z(vec4) {
        this.m[0][2] = vec4.x;
        this.m[1][2] = vec4.y;
        this.m[2][2] = vec4.z;
        this.m[3][2] = vec4.w;
    }

    get T() {
        return new Vec4(
            this.m[0][3],
            this.m[1][3],
            this.m[2][3],
            this.m[3][3]
        );
    }

    set T(vec4) {
        this.m[0][3] = vec4.x;
        this.m[1][3] = vec4.y;
        this.m[2][3] = vec4.z;
        this.m[3][3] = vec4.w;
    }

    get A() {
        return new Vec4(
            this.m[0][0],
            this.m[0][1],
            this.m[0][2],
            this.m[0][3]
        );
    }

    set A(vec4) {
        this.m[0][0] = vec4.x;
        this.m[0][1] = vec4.y;
        this.m[0][2] = vec4.z;
        this.m[0][3] = vec4.w;
    }

    get B() {
        return new Vec4(
            this.m[1][0],
            this.m[1][1],
            this.m[1][2],
            this.m[1][3]
        );
    }

    set B(vec4) {
        this.m[1][0] = vec4.x;
        this.m[1][1] = vec4.y;
        this.m[1][2] = vec4.z;
        this.m[1][3] = vec4.w;
    }

    get C() {
        return new Vec4(
            this.m[2][0],
            this.m[2][1],
            this.m[2][2],
            this.m[2][3]
        );
    }

    set C(vec4) {
        this.m[2][0] = vec4.x;
        this.m[2][1] = vec4.y;
        this.m[2][2] = vec4.z;
        this.m[2][3] = vec4.w;
    }

    get D() {
        return new Vec4(
            this.m[3][0],
            this.m[3][1],
            this.m[3][2],
            this.m[3][3]
        );
    }

    set D(vec4) {
        this.m[3][0] = vec4.x;
        this.m[3][1] = vec4.y;
        this.m[3][2] = vec4.z;
        this.m[3][3] = vec4.w;
    }

    translate(vec4) {
        this.T = this.T.plus(vec4);
    }

    static translate(mat4, vec4) {

    }

    // "rotate 90 degrees clockwise about the Y axis"
    // "rotate 45 degrees counterclockwise about the Z axis"
    // we need matrix multiplication for this
    rotate(angle, unit, direction, axis) {
        // I'm going to derive this step by step

        let angleRadians;

        if (unit === "degrees") {
            angleRadians = degreesToRadians(angle);
        } else if (unit === "radians") {
            angleRadians = angle;
        }

        if (axis.toUpperCase() === "Z") {

            // up vector will be a unit vector until we add support for scaling

            const currentAngleOfUpVector = Math.acos(this.up.x);

            let newAngleOfUpVector;

            if (direction === "clockwise") {
                newAngleOfUpVector = currentAngleOfUpVector + angleRadians;
            } else if (direction === "counterclockwise") {
                newAngleOfUpVector = currentAngleOfUpVector - angleRadians;
            }


        }
    }

    // allow both vectors and matrixes, although that's a bit sketch in js
    times(multiplier) {
        if (multiplier instanceof Vec4) {
            const vec4 = multiplier;
            return new Vec4(
                vec4.dot(this.A),
                vec4.dot(this.B),
                vec4.dot(this.C),
                vec4.dot(this.D)
            );
        } else if (multiplier instanceof Mat4) {
            const mat4 = multiplier;
            return new Mat4({
                X: this.times(mat4.X),
                Y: this.times(mat4.Y),
                Z: this.times(mat4.Z),
                T: this.times(mat4.T)
            });
        }
    }
}




















