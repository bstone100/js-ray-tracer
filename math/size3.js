export class Size3 {
    constructor(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    get volume() {
        return this.width * this.height * this.depth;
    }
}