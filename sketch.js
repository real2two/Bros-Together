let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let clearColor;

let FONT_PATHS = ["Sono-Regular.ttf"];
let FONTS = {};

function preload() {
    for (let f of FONT_PATHS)
        FONTS[f] = loadFont(f);
}

function setup() {
    createCanvas(windowWidth, windowHeight - 1, WEBGL);

    cx = width / 2;
    cy = height / 2;
    clearColor = color(0);

    gl = document.getElementById("defaultCanvas0").getContext("webgl");

    rectMode(CENTER);
    textAlign(CENTER);
    textFont(FONTS[FONT_PATHS[0]]);

    setScene(SCENES[0]);
}

function draw() {
    push();
    currentScene.draw();
    pop();

    begin2D();
    // The UI issue has something to do with translation:
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