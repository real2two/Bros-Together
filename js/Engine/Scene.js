let SCENES = [];

function setScene(p_scene) {
    currentScene = p_scene;
    currentScene.setup();
}

class Scene {
    constructor() {
        SCENES.push(this);
        this.ANIMATIONS = [];
    }

    setup() { }

    // DO not touch!
    update() {
        this.draw();
    }

    draw() { }

    drawUi() { }

    mousePressed() { }

    mouseMoved() { }

    mouseWheel() { }

    mouseDragged() { }

    mouseReleased() { }

    keyPressed() { }

    keyTyped() { }

    keyReleased() { }
}