let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let clearColor;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    cx = width / 2;
    cy = height / 2;
    clearColor = color(0);

    gl = document.getElementById("defaultCanvas0").getContext("webgl");

    rectMode(CENTER);
    textAlign(CENTER);
}

function draw() {
    gl.disable(gl.DEPTH_TEST);
    fill(0, 100);
    rect(-25, -25, width + 25, height + 25);
    gl.enable(gl.DEPTH_TEST);

    perspective();
    camera();
    currentScene.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    cx = width / 2;
    cy = height / 2;
}

function keyPressed() { currentScene.keyPressed(); }
function mousePressed() { currentScene.mousePressed(); }