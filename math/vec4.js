export class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    plus(vec4) {
        return new this.constructor(
            this.x + vec4.x,
            this.y + vec4.y,
            this.z + vec4.z,
            this.w
        );
    }

    minus(vec4) {
        return new this.constructor(
            this.x - vec4.x,
            this.y - vec4.y,
            this.z - vec4.z,
            this.w
        );
    }

    dot(vec4) {
        return this.x * vec4.x + this.y * vec4.y + this.z * vec4.z + this.w * vec4.w;
    }

    times(multiplier) {
        if (typeof multiplier === "number") {
            return new this.constructor(
                this.x * multiplier,
                this.y * multiplier,
                this.z * multiplier,
                this.w
            );
        } else if (multiplier instanceof Vec4) {
            return new this.constructor(
                this.x * multiplier.x,
                this.y * multiplier.y,
                this.z * multiplier.z,
                this.w
            );
        }
    }

    dividedBy(denominator) {
        if (typeof denominator === "number") {
            return this.times(1 / denominator);
        } else if (denominator instanceof Vec4) {
            return new this.constructor(
                this.x / denominator.x,
                this.y / denominator.y,
                this.z / denominator.z,
                this.w
            );
        }
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    toUnit() {
        return this.dividedBy(this.length);
    }
}

























