let cx = 0.0, cy = 0.0;
let currentScene;
let gl;
let fps;

let FONT_PATHS = ["../res/Sono-Regular.ttf"];
let FONTS = {};

function preload() {
    for (let f of FONT_PATHS)
        FONTS[f] = loadFont(f);

    // WIP.
    wipBrahvimChangeThis();
}

async function wipBrahvimChangeThis() {
    soundFormats('mp3');
    // uses p5.sound because that's already really good!
    // all loadAudio(id, file) does is set the variable AUDIO[<audio id>] into the p5.sound function.
    await loadAudio('rickroll', 'copyrighted_music.mp3'); // AUDIO['rickroll'].play(); (plays a rickroll)

    const sheet = new Spritesheet('test.png');
    await sheet.createSprite('numbers', {
        count: [
            {
                x: 0,
                y: 0,
                width: 20,
                height: 29
            },
            {
                x: 24,
                y: 0,
                width: 20,
                height: 29
            },
            {
                x: 49,
                y: 0,
                width: 20,
                height: 29
            }
        ]
    });
    console.log('sprites', SPRITES);
    //console.log(sheet.sheet.canvas.toDataURL());
    //for (const frame of SPRITES.numbers['count']) console.log(frame.canvas.toDataURL());
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    cx = width / 2;
    cy = height / 2;

    gl = document.getElementById("defaultCanvas0").getContext("webgl");

    frameRate(60); // I get `71` on my machine, limit it!
    // ...
    // ..I still get `71` on my machine.

    rectMode(CENTER);
    textAlign(CENTER);
    textFont(FONTS[FONT_PATHS[0]], 32);

    setScene(SCENES[0]);
}

function draw() {
    push();
    currentScene.draw();
    pop();

    fps = int(frameRate());

    begin2D();
    // The UI issue has something to do with translation:
    translate(-cx, -cy);
    currentScene.drawUi();
    end2D();

    // WIP sprite rendering.
    begin2D();
    translate(-cx, -cy);
    renderSprite('numbers', 'count', Math.floor((Date.now() % 3000) / 1000), 0, 50);
    end2D();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    cx = width / 2;
    cy = height / 2;
}

function keyPressed() { currentScene.keyPressed(); }
function mousePressed() { currentScene.mousePressed(); }