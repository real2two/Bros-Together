let SCENES = [];

function setScene(p_scene) {
    currentScene = p_scene;
    currentScene.setup();

    let sObj;
    for (let s in SOUNDS) {
        sObj = s;
        delete s;
        s = sObj;
    }
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

    mouseClicked() { }

    mousePressed() { }

    mouseMoved() { }

    mouseWheel() { }

    mouseDragged() { }

    mouseReleased() { }

    keyPressed() { }

    keyTyped() { }

    keyReleased() { }
}