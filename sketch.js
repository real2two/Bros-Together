let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let fps;
let pfocused, winFocus = true, pwinFocus = true, docFocus = true, pdocFocus;

let visible_fixed;

// Assets:
let FONT_PATHS = ["../res/Sono-Regular.ttf"];
let FONTS = {};
let SOUNDS = {};
let testsheet, testImage;
let { Composite, Events, Vector, Body, Bodies, Engine, Detector } = Matter;

function preload() {
    soundFormats('mp3');
    loadAudio("rickroll");

    for (let f of FONT_PATHS)
        FONTS[f] = loadFont(f);

    testsheet = new Spritesheet('test.png');
    //testImage = loadImage("img/test.png");


}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    cx = width / 2;
    cy = height / 2;

    gl = document.getElementById("defaultCanvas0").getContext("webgl");

    window.addEventListener('blur', () => {
        //console.log("Browser minimized...");
        winFocus = false;
    }, false);

    window.addEventListener('focus', () => {
        //console.log("Browser in focus.");
        winFocus = true;
    }, false);

    rectMode(CENTER);
    textAlign(CENTER);
    textFont(FONTS[FONT_PATHS[0]], 32);

    testsheet.cropAll(24);
    //testsheet.crop(0, 0, 20, 29);
    //testsheet.crop(24, 0, 20, 29);
    //testsheet.crop(49, 0, 20, 29);

    setScene(titleScene);
}

function draw() {
    docFocus = document.hasFocus();

    // Nothing works. These won't prevent the Physics Engine from wrongly calculating
    // if the user switches application windows:

    if (!pdocFocus && docFocus) deltaTime = 0;
    if (!pdocFocus && document.hasFocus()) deltaTime = 0;
    if (!pwinFocus && winFocus) deltaTime = 0;
    if (!pfocused && focused) deltaTime = 0;

    if (deltaTime != 0)
        currentScene.update();

    push();
    //for (let a of currentScene.ANIMATIONS)
    //a.frameN++;
    currentCam.apply();
    currentScene.draw();
    pop();

    fps = int(frameRate());

    begin2D();
    translate(-cx, -cy);
    currentScene.drawUi();
    end2D();

    pfocused = focused;
    pwinFocus = winFocus;
    pdocFocus = docFocus;
}


//#region p5 Event Callbacks:
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    cx = width / 2;
    cy = height / 2;
}

function keyPressed() { currentScene.keyPressed(); }
function mousePressed() { currentScene.mousePressed(); }
//#endregion

