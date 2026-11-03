import { Vec4 } from "./vec4.js";
import { degreesToRadians } from "../utils.js";

// column major
export class Mat4 {
    constructor({X, Y, Z, T, A, B, C, D, transforms, mat4}) {
        // start with identity matrix
        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // you can provide a matrix to duplicate
        if (mat4) {
            this.X = mat4.X;
            this.Y = mat4.Y;
            this.Z = mat4.Z;
            this.T = mat4.T;
        }

        // you can provide a list of operations to be performed in order on the matrix
        if (transforms) {
            for (const t of transforms) {
                if (t.operation === "rotate") {
                    this.rotate(t.angle, t.unit, t.direction, t.axis);
                } else if (t.operation === "translate") {
                    this.translate(new Vec4(t.x, t.y, t.z, 0));
                }
            }
        }

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

    get translation() {
        return this.T;
    }

    static getRotationMatrix(angle, unit, direction, axis) {
        const angleRadians = unit === "degrees" ? degreesToRadians(angle) : angle;
        if (axis.toUpperCase() === "Z") {
            const angleDirected = direction === "counterclockwise" ? -angleRadians : angleRadians;
            const xAngle = angleDirected;
            const yAngle = Math.PI / 2 + angleDirected;
            return new Mat4({
                X: new Vec4(
                    Math.cos(xAngle),
                    Math.sin(xAngle),
                    0,
                    0
                ),
                Y: new Vec4(
                    Math.cos(yAngle),
                    Math.sin(yAngle),
                    0,
                    0
                )
            });
        } else if (axis.toUpperCase() === "Y") {
            const angleDirected = direction === "clockwise" ? -angleRadians : angleRadians;
            const xAngle = angleDirected;
            const zAngle = Math.PI / 2 + angleDirected
            return new Mat4({
                X: new Vec4(
                    Math.cos(xAngle),
                    0,
                    Math.sin(xAngle),
                    0
                ),
                Z: new Vec4(
                    Math.cos(zAngle),
                    0,
                    Math.sin(zAngle),
                    0
                )
            });
        } else if (axis.toUpperCase() === "X") {
            const angleDirected = direction === "clockwise" ? -angleRadians : angleRadians;
            const zAngle = angleDirected;
            const yAngle = Math.PI / 2 + angleDirected;
            return new Mat4({
                Y: new Vec4(
                    0,
                    Math.sin(yAngle),
                    Math.cos(yAngle),
                    0
                ),
                Z: new Vec4(
                    0,
                    Math.sin(zAngle),
                    Math.cos(zAngle),
                    0
                )
            });
        }
    }

    rotate(angle, unit, direction, axis) {
        this.m = this.times(Mat4.getRotationMatrix(angle, unit, direction, axis)).m;
    }

    get rotation() {
        // return this matrix with translation removed
        return new Mat4({
            X: this.X,
            Y: this.Y,
            Z: this.Z
        });
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

    toInverted() {
        return new Mat4({
            A: new Vec4(
                this.X.x,
                this.X.y,
                this.X.z,
                -this.T.dot(this.X)
            ),
            B: new Vec4(
                this.Y.x,
                this.Y.y,
                this.Y.z,
                -this.T.dot(this.Y)
            ),
            C: new Vec4(
                this.Z.x,
                this.Z.y,
                this.Z.z,
                -this.T.dot(this.Z)
            )
        });
    }
}




















