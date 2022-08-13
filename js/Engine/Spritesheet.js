class Spritesheet {
    constructor(sheet) {
        this.sheet = loadImage(`img/${sheet}`);
        this.sprites = [];
    }

    crop(x, y, width, height) {
        const sprite = createImage(width, height);
        sprite.copy(this.sheet, x, y, width, height, 0, 0, width, height);
        this.sprites.push(sprite);
    }
}