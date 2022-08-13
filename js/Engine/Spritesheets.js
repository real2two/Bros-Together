const SPRITES = {};

class Spritesheet {
    constructor(sheet) {
        this.sheet = loadImage(`img/${sheet}`);
    }

    async createSprite(id, animations) {
        const ANIMATIONS = {};

        /*
        animations
        {
            "<id>": [ // eg. 'walking'. (an action.)
            {
                "x": <x>
                "y": <y>,
                "width": <width>,
                "height": <height>
            }
            ...
        }

        ANIMATIONS
        {
            "<id>": [
                this.cropSheet(x, y, width, height),
                ...
            ],
            ...
        }
        */

        for (const [ id, frames ] of Object.entries(animations)) {
            ANIMATIONS[id] = [];
            for (const { x, y, width, height } of frames) {
                ANIMATIONS[id].push(this.cropSheet(x, y, width, height));
            }
        }

        return SPRITES[id] = ANIMATIONS;
    }

    cropSheet(x, y, width, height) {
        const sprite = createImage(width, height); // createGraphics()
        sprite.copy(this.sheet, x, y, width, height, 0, 0, width, height);
        return sprite;
    }
}

function renderSprite(id, animation, frame, x = 0, y = 0) {
    if (!SPRITES[id]) return console.warn('Cannot find:', id, animation, frame);
    image(SPRITES[id][animation][frame], x, y);
}

function clearSprites() {
    for (const [ id ] of Object.entries(SPRITES)) delete SPRITES[id];
}