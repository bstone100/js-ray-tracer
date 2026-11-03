export class Size2 {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }

    get volume() {
        return this.width * this.height;
    }
}