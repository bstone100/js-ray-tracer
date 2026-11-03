export class Size2 {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    get volume() {
        return this.width * this.height;
    }
}