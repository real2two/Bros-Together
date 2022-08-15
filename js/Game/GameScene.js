// ALWAYS call the constructor (AKA use `new`), then modify properties:

let gameScene = new Scene();

let bg = [{ sprite: 'bg', x: 0, y: 0 }];

gameScene.setup = async function () {
    this.engine = Engine.create();

    //this.engine.gravity.scale = pow(10, -4); // Water.
    //this.engine.gravity.scale = pow(10, -3.7); // Soft Land.
    this.engine.gravity.scale = pow(10, -3.5); // A bit too much.
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
    this.player.isTouchingBlock = false;
    this.player.touchedBlockHeight = 0.0;
    this.player.touchedBlockExtents = { begin: 0, end: 0 };
    this.player.lastDeathTime = 0;

    Body.setMass(this.player, 25);
    Body.setInertia(this.player, Infinity);

    // load level
    await cacheLevels();
    loadLevelByID(1);

    //#region Player Grounding.
    Events.on(this.engine, "collisionStart", function (p_event) {
        for (const { bodyA, bodyB } of p_event.pairs) {
            gameScene.player.isTouchingBlock = true;

            if ([bodyA, bodyB].includes(gameScene.player)) {
                const other = bodyA === gameScene.player ? bodyB : bodyA;

                if (other && other.killzone) {
                    killPlayer();
                    return;
                }

                if (other && other.is && other.is === 'collectable') {
                    Composite.remove(gameScene.engine.world, other);
                    // It said `gameScene.game.indexOf()` :joy::
                    gameScene.bodies.splice(gameScene.bodies.indexOf(other), 1);
                    ++points;
                    got_point = true;
                    continue;
                }

                //gameScene.player.touchedBlockHeight = 0;
                gameScene.player.touchedBlockExtents = { begin: Infinity, end: -Infinity }

                for (let v of other.vertices) {
                    gameScene.player.touchedBlockHeight = v.y;
                    if (gameScene.player.touchedBlockHeight > v.y)
                        gameScene.player.touchedBlockHeight = v.y;

                    gameScene.player.touchedBlockExtents.begin = v.x;
                    if (v.x < gameScene.player.touchedBlockExtents.begin)
                        gameScene.player.touchedBlockExtents.begin = v.x;

                    gameScene.player.touchedBlockExtents.end = v.x;
                    if (v.x > gameScene.player.touchedBlockExtents.end)
                        gameScene.player.touchedBlockExtents.end = v.x;
                }
                //

                if (['static', 'movable'].includes(other.is)) {
                    /*
                    if (gameScene.player.isTouchingBlock && // Unnecessary check
                        gameScene.player.position.y < gameScene.player.touchedBlockHeight &&
                        gameScene.player.position.x < gameScene.player.touchedBlockExtents.end &&
                        gameScene.player.position.x > gameScene.player.touchedBlockExtents.begin
                    )
                    */
                    gameScene.player.grounded = true;
                }
            }
        }
    }
    );

    Events.on(this.engine, "collisionEnd", function (p_event) {
        gameScene.player.isTouchingBlock = false;
        //gameScene.player.touchedBlockHeight = null;

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

    /*
    this.fadeWave = new SineWave(0.01, 0);
    console.log(this.fadeWave);
    this.fadeWave.endWhenAngleAccumulatesTo(120);
    this.cam.script = (p_cam) => {
        switch (level) {
            case 1:
                p_cam.pos.z += this.fadeWave.get() * 250;
                break;
        }
        //p_cam.pos.x = sin(millis() * 0.001) * 250;
        //p_cam.center.x = p_cam.pos.x;
    }
    this.fadeWave.set(0);
    */
}

gameScene.update = function () {
    // These are slow. Simply setting the inertia to `Infinity` is better!
    //Body.setAngle(this.player, 0);
    //Body.setAngularVelocity(this.player, 0);

    //#region Tab switch:
    // The user can switch tabs, but cannot change applications:
    if (!!focused && !!docFocus && !!winFocus &&
        !!document.hasFocus() && document.visibilityState === 'visible') {
        if (recording && !recording_since) recording_since = performance.now();

        Engine.update(this.engine, deltaTime > 64 ? 64 : deltaTime);

        //#region Player Loop:
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
        //#region
        if (!loading_level && !playing_recording && keyIsDown(65)) { // a
            Body.applyForce(this.player, this.player.position, Vector.create(-0.01, 0));
        }

        if (!loading_level && !playing_recording && keyIsDown(68)) { // d
            Body.applyForce(this.player, this.player.position, Vector.create(0.01, 0));
        }

        //#endregion

        // `S` key:
        //if (keyIsDown(83))
        //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));

        if (this.player.position.y > 250)
            return killPlayer();

        if (this.player.position.x > 640 / 2 || this.player.position.x < -640 / 2) {
            if (playing_recording) {
                stopPlayingRecording();
            } else {
                nextLevel();
            }
        }

        // `S` key:
        //if (keyIsDown(83))
        //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));
    }
}

gameScene.draw = function () {
    if (playing_recording && playing_actions) {
        const frame = Math.floor((performance.now() - started_playing) / 16);
        if (playing_actions[frame]) {
            bot_pos = playing_actions[frame];
        } else {
            stopPlayingRecording();
        }
    }
    
    for (let b of this.bodies) {
        if (b.hidden) continue;

        push();

        if (loadedBodies.includes(b)) { // Styling changes:
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

            if (b.killzone)
                stroke('#EE4B2B');
        }

        if (this.player === b && playing_recording) {
            pop();
            continue;
        }

        //if (this.player === b && playing_recording)
        //    fill(68, 135, 246);

        beginShape(TESS);
        for (let v of b.vertices)
            vertex(v.x, v.y);
        endShape(CLOSE);

        //if (this.player === b && playing_recording) {
        //    textAlign(CENTER);
        //    fill(0);
        //    textSize(15);
        //    text('AI', b.vertices[0].x + 10, b.vertices[0].y + 15);
        //}

        pop();
    }

    if (playing_recording) {
        push();
        translate(bot_pos.x, bot_pos.y);
        fill(68, 135, 246);
        square(0, 0, 20);
        textAlign(CENTER);
        fill(0);
        textSize(15);
        text('AI', 0, 5);
        pop();
    }

    // Rendering:
    for (let { id, x = 0, y = 0, width, height, only_show_when_playing_recording } of shown_sprites) {
        if (!playing_recording && only_show_when_playing_recording) continue;
        if (!id || !SPRITES[id] || typeof x !== 'number' || typeof y !== 'number' ||
            typeof width !== 'number' || typeof height !== 'number')
            continue;

        push();
        translate(x, y);
        imageMode(CENTER);
        image(SPRITES[id].sheet, 0, 0, width, height);
        pop();
    }

    // ..also rendering:
    for (const { sprite, x, y } of bg) {
        push();
        translate(x - (this.player.positionPrev.x / 2), y - (this.player.positionPrev.y / 6));
        imageMode(CENTER);
        image(SPRITES[sprite].sheet, 0, 0, width, height);
        pop();
    }
}

gameScene.drawUi = function () {
    // This function makes sure the text is on the corner:
    //textOff(fps, 0, 0);
    textOff(`Points: ${points}`, 15, 15);

    // Debugging Coordinates:
    if (!PRODUCTION && mouseIsPressed) {
        push();
        rectMode(CORNER);
        fill(127);
        // Best approximation without using projection:
        let coords = `${(mouseX - cx) / 2}, ${(mouseY - cy) / 2}`;
        let twid = textWidth(coords);
        translate(mouseX > cx ? mouseX - twid : mouseX, mouseY);
        rect(0, 0, twid, 36);
        textSize(32);
        fill(255);
        textOff(coords, 0, 0);
        pop();
    }
}

gameScene.keyPressed = function name() {
    if (loading_level || playing_recording)
        return;

    switch (keyCode) {
        case 87:
            jump();
            break;

        case 82: // `R`
            console.log("Resetting...");

            killPlayer();
            break;
    }
}

function killPlayer() {
    if (got_point) --points;
    gameScene.player.lastDeathTime = performance.now();
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
        gameScene.player.firstJump = false;
    } else if (gameScene.player.firstJump) {
        // Double jump:
        Body.applyForce(gameScene.player, gameScene.player.position, Vector.create(0, -0.28));
        gameScene.player.firstJump = false;
    }
}