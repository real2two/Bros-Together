class Spritesheet {
    constructor(p_sheet) {
        this.sheet = loadImage(`img/${p_sheet}`);
        this.sprites = [];
    }

    crop(p_x, p_y, p_width, p_height) {
        const sprite = createImage(p_width, p_height);
        sprite.copy(this.sheet, p_x, p_y, p_width, p_height, 0, 0, p_width, p_height);
        this.sprites.push(sprite);
    }

    cropAll(p_imageWidth) {
        let mHeight = this.sheet.height;
        for (let i = 0; i < p_imageWidth; i += p_imageWidth) {
            const sprite = createImage(p_imageWidth, mHeight);
            sprite.copy(this.sheet, i, 0, p_imageWidth, mHeight, 0, 0, p_imageWidth, mHeight);
            this.sprites.push(sprite);
        }
    }


    // Idea for the future: a function to automatically 'travel' through the image,
    // cropping out all images horizontally. 

    // ...something we could add but is unnecessary since we know as programmers that
    // images can have any dimensions:

    // If more pixels exist **vertically** when it 
    // already has the last image from "the current row", it will go onto the 
    // "next column" to start cropping images again.

    // ^^^ ...would work if we also checked for empty pixels. Well, the user could
    // even go on to place the image at a COMPLETELY different position in the sheet, so...
    // ...*no*.
}