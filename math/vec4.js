export class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    plus(vec4) {
        return new Vec4(
            this.x + vec4.x,
            this.y + vec4.y,
            this.z + vec4.z,
            this.w
        );
    }

    minus(vec4) {
        return new Vec4(
            this.x - vec4.x,
            this.y - vec4.y,
            this.z - vec4.z,
            this.w
        );
    }

    dot(vec4) {
        return this.x * vec4.x + this.y * vec4.y + this.z * vec4.z + this.w * vec4.w;
    }

    times(scalar) {
        return new Vec4(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar,
            this.w
        );
    }

    dividedBy(scalar) {
        return this.times(1 / scalar);
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    toUnit() {
        return this.dividedBy(this.length);
    }
}

























