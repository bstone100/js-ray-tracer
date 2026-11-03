export class Size3 {
    constructor(width = 0, height = 0, depth = 0) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    get volume() {
        return this.width * this.height * this.depth;
    }
}