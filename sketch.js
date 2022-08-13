// Transformations:
let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let fps;

// Assets:
let FONT_PATHS = ["../res/Sono-Regular.ttf"];
let FONTS = {};
let SOUNDS = {};
let testsheet;

function preload() {
    soundFormats('mp3');
    loadAudio("rickroll");

    for (let f of FONT_PATHS)
        FONTS[f] = loadFont(f);

    // WIP

    testsheet = new Spritesheet('test.png');
    testsheet.crop(0, 0, 20, 29);
    testsheet.crop(24, 0, 20, 29);
    testsheet.crop(49, 0, 20, 29);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    cx = width / 2;
    cy = height / 2;

    gl = document.getElementById("defaultCanvas0").getContext("webgl");

    rectMode(CENTER);
    textAlign(CENTER);
    textFont(FONTS[FONT_PATHS[0]], 32);

    setScene(SCENES[0]);
}

function draw() {
    currentScene.update();

    push();
    currentScene.draw();
    pop();

    fps = int(frameRate());

    begin2D();
    translate(-cx, -cy);
    currentScene.drawUi();
    end2D();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    cx = width / 2;
    cy = height / 2;
}

function keyPressed() { currentScene.keyPressed(); }
function mousePressed() { currentScene.mousePressed(); }