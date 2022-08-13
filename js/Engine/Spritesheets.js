class Spritesheet {
    constructor(sheet) {
        this.sheet = loadImage(`img/${sheet}`);
        this.frames = [];
    }

    cropSheet(x, y, width, height) {
        const sprite = createImage(width, height); // createGraphics()
        sprite.copy(this.sheet, x, y, width, height, 0, 0, width, height);
        return this.frames.push(sprite);
    }
}