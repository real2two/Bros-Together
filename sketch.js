const PRODUCTION = !window.location.href.startsWith('http://localhost');
if (PRODUCTION === false) {
    document.getElementById('level_data').style.display = 'none';
    document.getElementById('debug').style.display = 'block';
    document.getElementById('play_recording').style.display = 'block';
    document.getElementsByTagName('title')[0].innerText = '[DEBUG] Wowie 4.0 Submission!';
}

// Beware that going to `http://127.0.0.1:5500/` will NOT give you debug mode.

let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let fps;
let pfocused, winFocus = true, pwinFocus = true, docFocus = true, pdocFocus;

let visible_fixed;

// Assets:
let FONT_PATHS = ["res/Sono-Regular.ttf"];
let FONTS = {};
let SOUNDS = {};
let testsheet, testImage;
let { Composite, Events, Vector, Body, Bodies, Engine, Detector } = Matter;

let SPRITES = {};

let coinBloomTexture;

function preload() {
    soundFormats('mp3', 'wav');

    // Give the full name of the file.
    // It'll automatically truncate the extension,
    // ..for the name name of the property of `SOUNDS`.
    loadAudio("coin.wav");
    loadAudio("killzone.wav");
    loadAudio("jump_low.mp3");
    loadAudio("jump_high.mp3");
    loadAudio("Title.mp3");

    for (let f of FONT_PATHS)
        FONTS[f] = loadFont(f);

    coinBloomTexture = loadImage("img/coin_bloom.png");

    testsheet = new Spritesheet('test.png');

    SPRITES['bg'] = new Spritesheet('bg.png');

    SPRITES['controls'] = new Spritesheet('controls_and_exit.png');
    SPRITES['how_to_win'] = new Spritesheet('ai_shows.png');
    SPRITES['you_win'] = new Spritesheet('you_win.png');

    SPRITES['map_editor'] = new Spritesheet('map_editor.png');
    SPRITES['how_to_unlock'] = new Spritesheet('how_to_unlock.png');

    SPRITES['level-6'] = new Spritesheet('level-6.png');
    SPRITES['level-9'] = new Spritesheet('level-9.png');
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

function keyPressed() { if (currentScene) currentScene.keyPressed(); }
function mousePressed() { if (currentScene) currentScene.mousePressed(); }
function mouseClicked() { if (currentScene) currentScene.mouseClicked(); }
//#endregion

