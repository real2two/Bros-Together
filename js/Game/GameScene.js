// ALWAYS call the constructor (AKA use `new`), then modify properties:

let gameScene = new Scene();

let bg = [{ sprite: 'bg', x: 0, y: 0 }];

gameScene.setup = async function () {
    this.engine = Engine.create();

    //this.engine.gravity.scale = pow(10, -4); // Water.
    this.engine.gravity.scale = pow(10, -3.7); // Soft Land.
    //this.engine.gravity.scale = pow(10, -3.5); // A bit too much.
    // Going any higher for the exponent may result in collisions missing.

    this.world = this.engine.world;
    this.bodies = [];

    this.cam = new Camera();
    this.cam.clearColor = color(0, 120);
    setCam(this.cam);

    // Put them "into the scene" like this.
    // The `.push()`-ing is automatic as long as there is a `bodies[]` or `blocks[]` :D
    this.player = createBlock(0, 0, 20, 20);
    this.player.grounded = false;
    this.player.firstJump = false;
    Body.setMass(this.player, 25);
    Body.setInertia(this.player, Infinity);

    // load level
    await cacheLevels();
    loadLevelByID(1);

    //#region Player Grounding.
    Events.on(this.engine, "collisionStart", function (p_event) {
        for (const { bodyA, bodyB } of p_event.pairs) {
            if ([bodyA, bodyB].includes(gameScene.player)) {
                const other = bodyA === gameScene.player ? bodyB : bodyA;

                if (other && other.killzone) {
                    return killPlayer();
                }

                if (other && other.is && other.is === 'collectable') {
                    Composite.remove(currentScene.engine.world, other);
                    currentScene.bodies.splice(currentScene.bodies.indexOf(other), 1);

                    ++points;

                    continue;
                }

                if (['static', 'movable'].includes(other.is)) gameScene.player.grounded = true;
            }
        }
    });

    Events.on(this.engine, "collisionEnd", function (p_event) {
        for (const { bodyA, bodyB } of p_event.pairs) {
            if ([bodyA, bodyB].includes(gameScene.player)) {
                const other = bodyA === gameScene.player ? bodyB : bodyA;
                if (['static', 'movable'].includes(other.is) && !other.removed) {
                    gameScene.player.firstJump = true;
                    gameScene.player.grounded = false;
                }
            }
        }
    });
    //#endregion

    // "Camera scripts" are functions that get a `Camera` as a parameter.
    // You modify the properties of the camera YOU RECEIVE, so the functionality can be transferred over.

    this.cam.script = function name(p_cam) {
        //p_cam.pos.x = sin(millis() * 0.001) * 250;
        //p_cam.center.x = p_cam.pos.x;
    }
}

gameScene.update = function () {
    // These are slow. Simply setting the inertia to `Infinity` is betterwwwww.
    //Body.setAngle(this.player, 0);
    //Body.setAngularVelocity(this.player, 0);

    //#region Tab switch:
    // The user can switch tabs, but cannot change applications:
    if (!!focused && !!docFocus && !!winFocus &&
        !!document.hasFocus() && document.visibilityState === 'visible') {
        if (recording && !recording_since) recording_since = performance.now();

        Engine.update(this.engine, deltaTime > 64 ? 64 : deltaTime);

        /*
        if (this.player.position.x > 640 / 2)
            Body.setPosition(this.player, {
                x: -640 / 2,
                y: this.player.position.y > cy ? cy : this.player.position.y
            });
        else if (this.player.position.x < -640 / 2)
            Body.setPosition(this.player, {
                x: 640 / 2,
                y: this.player.position.y > cy ? cy : this.player.position.y
            });
            */

        //#endregion

        // `W` / jumping is handled in the `testScene.keyPressed()` function.
        // Here we handle the sides:
        if (!loading_level && !playing_recording && keyIsDown(65) || playing_recording && holding['a']) { // a
            logMovement('a', true);

            Body.applyForce(this.player, this.player.position, Vector.create(-0.01, 0));

            forces["frame"] = frameCount;
            forces["frame"]["x"] = -0.01;
            forces["frame"]["y"] = 0;
        } else {
            logMovement('a', false);
        }

        if (!loading_level && !playing_recording && keyIsDown(68) || playing_recording && holding['d']) { // d
            logMovement('d', true);

            Body.applyForce(this.player, this.player.position, Vector.create(0.01, 0));
            forces["frame"] = frameCount;
            forces["frame"]["x"] = 0.01;
            forces["frame"]["y"] = 0;
        } else {
            logMovement('d', false);
        }

        // `S` key:
        //if (keyIsDown(83))
        //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));

        if (this.player.position.y > 250) return killPlayer();

        if (this.player.position.x > 640 / 2 || this.player.position.x < -640 / 2) {
            if (playing_recording) {
                stopPlayingRecording();
            } else {
                nextLevel();
                console.log(JSON.stringify(forces));
            }
        }

        // `S` key:
        //if (keyIsDown(83))
        //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));
    } else {
        stopPlayingRecording();
    }
}

//#region `gameScene.draw()`:
gameScene.draw = function () {
    for (let b of this.bodies) {
        if (b.hidden) continue;

        push();

        if (loadedBodies.includes(b)) {
            switch (b.is) {
                case 'movable':
                    fill(150);
                    break;
                case 'collectable':
                    fill('#F4DF4E')
                    break;
                case 'static':
                default:
                    noFill();
                    stroke(255);
                    break;
            }

            if (b.killzone) {
                stroke('#EE4B2B');
            }
        }

        beginShape(TESS);
        for (let v of b.vertices)
            vertex(v.x, v.y);
        endShape(CLOSE);

        if (this.player === b && playing_recording) {
            textAlign(CENTER);
            fill(0);
            textSize(15);
            text('AI', b.vertices[0].x + 10, b.vertices[0].y + 15);
        }

        pop();
    }

    for (let { id, x = 0, y = 0, width, height } of shown_sprites) {
        if (!id || !SPRITES[id] || typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') continue;

        push();
        translate(x, y);
        imageMode(CENTER);
        image(SPRITES[id].sheet, 0, 0, width, height);
        pop();
    }

    for (const { sprite, x, y } of bg) {
        push();
        translate(x - (this.player.positionPrev.x / 2), y);
        imageMode(CENTER);
        image(SPRITES[sprite].sheet, 0, 0, width, height);
        pop();
    }
}
//#endregion

gameScene.drawUi = function () {
    // This function makes sure the text is on the corner:
    //textOff(fps, 0, 0);
    textOff(`Points: ${points}`, 15, 15);

    // Debugging Coordinates:
    if (mouseIsPressed) {
        //#region
        push();
        rectMode(CORNER);
        fill(127);
        let coords = `${mouseX}, ${mouseY}`;
        let twid = textWidth(coords);
        translate(mouseX > cx ? mouseX - twid : mouseX, mouseY);
        rect(0, 0, twid, 36);
        textSize(32);
        fill(255);
        textOff(coords, 0, 0);
        pop();
        //#endregion
    }
}

gameScene.mousePressed = function () {
    //SOUNDS["Rickroll"].play();
}

let forces = {};

gameScene.keyPressed = function name() {
    if (loading_level || playing_recording) return;

    switch (keyCode) {
        case 87:
            logMovement('w');
            jump();
            break;

        case 82: // `R`
            console.log("Resetting...");

            killPlayer();
            break;
    }
}

function killPlayer() {
    gameScene.player.lastDeathPosition = { ...gameScene.player.position };
    loadLevel(loadedLevel);
}

let loading_level = false;

async function nextLevel() {
    stopRecording();

    gameScene.player.lastDeathPosition = null;

    if (old_level_data || level === MAX_LEVELS) {
        loadLevel(loadedLevel);
    } else {
        if (loading_level) return;

        loading_level = true;

        ++level;
        await loadLevelByID(level);

        loading_level = false;
    }
}

function jump() {
    if (gameScene.player.grounded) {
        Body.applyForce(gameScene.player, gameScene.player.position, Vector.create(0, -0.3));
        forces["frame"] = frameCount;
        forces["frame"]["x"] = 0;
        forces["frame"]["y"] = -0.3;
        gameScene.player.firstJump = false;
    } else if (gameScene.player.firstJump) {
        // Double jump:
        Body.applyForce(gameScene.player, gameScene.player.position, Vector.create(0, -0.28));
        forces["frame"] = frameCount;
        forces["frame"]["x"] = 0;
        forces["frame"]["y"] = -0.28;
        gameScene.player.firstJump = false;
    }
}