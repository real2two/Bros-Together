// ALWAYS call the constructor (AKA use `new`), then modify properties:

let gameScene = new Scene();

gameScene.setup = function () {
    this.engine = Engine.create();

    //this.engine.gravity.scale = pow(10, -4); // Water.
    this.engine.gravity.scale = pow(10, -3.7); // Soft Land.
    //this.engine.gravity.scale = pow(10, -3.5); // A bit too much.
    // Going any higher for the exponent may result in collisions missing.

    this.world = this.engine.world;
    this.bodies = [];

    this.anim = new Animator(testsheet); // There's already a class called "Animation" for CSS animations...

    console.log("Frames:", this.anim.frames);

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
    loadLevel(loadedLevel);

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

                    //++points;

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

        if (!!focused && !!docFocus && !!winFocus && !!document.hasFocus() && document.visibilityState === 'visible') {
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
            if (this.player.position.x > 640 / 2 || this.player.position.x < -640 / 2) {
                nextLevel();
                console.log(JSON.stringify(forces));
            }
            //#endregion

            // `W` / jumping is handled in the `testScene.keyPressed()` function.
            // Here we handle the sides:
            if (keyIsDown(65)) {
                Body.applyForce(this.player, this.player.position, Vector.create(-0.01, 0));

                forces["frame" + (frameCount - forcesStart)];
                forces["frame" + (frameCount - forcesStart) + "x"] = -0.01;
                forces["frame" + (frameCount - forcesStart) + "y"] = 0;
            }
            if (keyIsDown(68)) {
                Body.applyForce(this.player, this.player.position, Vector.create(0.01, 0));
                forces["frame" + (frameCount - forcesStart)];
                forces["frame" + (frameCount - forcesStart) + "x"] = 0.01;
                forces["frame" + (frameCount - forcesStart) + "y"] = 0;
            }

            if (keyIsDown(68))
                Body.applyForce(this.player, this.player.position, Vector.create(0.01, 0));

            // `S` key:
            //if (keyIsDown(83))
            //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));

        }

        // `S` key:
        //if (keyIsDown(83))
        //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));
    }
}

//#region `gameScene.draw()`:
gameScene.draw = function () {
    for (let b of this.bodies) {
        push();

        if (loadedBodies.includes(b)) {
            switch (b.is) {
                case 'static':
                    noFill();
                    stroke(255);
                    break;
                case 'movable':
                    fill(150);
                    break;
                case 'collectable':
                    fill('#F4DF4E')
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

        pop();
    }
};
//#endregion

gameScene.drawUi = function () {
    // This function makes sure the text is on the corner:
    textOff(fps, 0, 0);

    //this.anim.draw(mouseX, mouseY);
    //image(testsheet.sprites[1], mouseX, mouseY, 400, 400);

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

let forces = {}, forcesStart;

gameScene.keyPressed = function name() {
    switch (keyCode) {
        case 87:
            if (this.player.grounded) {
                Body.applyForce(this.player, this.player.position, Vector.create(0, -0.3));
                forces["frame" + (frameCount - forcesStart)];
                forces["frame" + (frameCount - forcesStart) + "x"] = 0;
                forces["frame" + (frameCount - forcesStart) + "y"] = -0.3;
                this.player.firstJump = false;
            } else if (this.player.firstJump) {
                // Double jump:
                Body.applyForce(this.player, this.player.position, Vector.create(0, -0.28));
                forces["frame" + (frameCount - forcesStart)];
                forces["frame" + (frameCount - forcesStart) + "x"] = 0;
                forces["frame" + (frameCount - forcesStart) + "y"] = -0.28;
                this.player.firstJump = false;
            }
            break;

        case 82: // `R`
            console.log("Resetting...");

            for (let prop in forces)
                delete prop;

            forces = {};
            forcesStart = frameCount;

            killPlayer();
            break;

        case 70:
            moveToScript(currentScene.player, {
                "frame37x": 0.01, "frame37y": 0, "frame38x": 0.01, "frame38y": 0, "frame39x": 0.01, "frame39y": 0, "frame40x": 0.01, "frame40y": 0, "frame41x": 0.01, "frame41y": 0, "frame42x": 0.01, "frame42y": 0, "frame43x": 0.01, "frame43y": 0, "frame44x": 0.01, "frame44y": 0, "frame45x": 0.01, "frame45y": 0, "frame46x": 0.01, "frame46y": 0, "frame47x": 0.01, "frame47y": 0, "frame48x": 0.01, "frame48y": 0, "frame49x": 0.01, "frame49y": 0, "frame50x": 0.01, "frame50y": 0, "frame51x": 0.01, "frame51y": 0, "frame52x": 0.01, "frame52y": 0, "frame53x": 0.01, "frame53y": 0, "frame54x": 0.01, "frame54y": 0, "frame55x": 0.01, "frame55y": 0, "frame56x": 0.01, "frame56y": 0, "frame57x": 0.01, "frame57y": 0, "frame58x": 0.01, "frame58y": 0, "frame59x": 0.01, "frame59y": 0, "frame60x": 0.01, "frame60y": 0, "frame61x": 0, "frame61y": -0.3, "frame62x": 0.01, "frame62y": 0, "frame63x": 0.01, "frame63y": 0, "frame64x": 0.01, "frame64y": 0, "frame65x": 0.01, "frame65y": 0, "frame66x": 0.01, "frame66y": 0, "frame67x": 0.01, "frame67y": 0, "frame68x": 0.01, "frame68y": 0, "frame69x": 0.01, "frame69y": 0, "frame70x": 0.01, "frame70y": 0, "frame71x": 0.01, "frame71y": 0, "frame72x": 0.01, "frame72y": 0, "frame73x": 0.01, "frame73y": 0, "frame74x": 0.01, "frame74y": 0, "frame75x": 0.01, "frame75y": 0, "frame76x": 0.01, "frame76y": 0, "frame77x": 0.01, "frame77y": 0, "frame78x": 0.01, "frame78y": 0, "frame79x": 0, "frame79y": -0.28, "frame80x": 0.01, "frame80y": 0, "frame81x": 0.01, "frame81y": 0, "frame82x": 0.01, "frame82y": 0, "frame83x": 0.01, "frame83y": 0, "frame84x": 0.01, "frame84y": 0, "frame85x": 0.01, "frame85y": 0, "frame86x": 0.01, "frame86y": 0, "frame87x": 0.01, "frame87y": 0, "frame88x": 0.01, "frame88y": 0, "frame89x": 0.01, "frame89y": 0, "frame90x": 0.01, "frame90y": 0, "frame91x": 0.01, "frame91y": 0, "frame92x": 0.01, "frame92y": 0, "frame93x": 0.01, "frame93y": 0, "frame94x": 0.01, "frame94y": 0, "frame95x": 0.01, "frame95y": 0, "frame96x": 0.01, "frame96y": 0, "frame97x": 0.01, "frame97y": 0, "frame98x": 0.01, "frame98y": 0, "frame99x": 0.01, "frame99y": 0
            });
            break;
    }
}

function killPlayer() {
    gameScene.player.lastDeathPosition = { ...gameScene.player.position };
    loadLevel(loadedLevel);
}

function nextLevel() {
    // ++level;

    gameScene.player.lastDeathPosition = null;
    loadLevel(loadedLevel);
}


async function moveToScript(p_body, p_script) {
    let prevProp = null;
    for (let prop in p_script) {
        setTimeout(
            Body.applyForce(p_body, p_body.position, {
                x: p_script[prop] || 0,
                y: p_script[prop] || 0
            }), 640
            /*
            * (float(parseInt(() => {
                let str = "";
                for (let i = 5; i < prop.length - 2; i++)
                    str.concat(prop[i]);
                return str;
            }))
                -
                float(parseInt(() => {
                    let str = "";
                    for (let i = 5; i < prevProp.length - 2; i++)
                        str.concat(prevProp[i]);
                    return str;
                })))
                */
        );

        prevProp = prop;
    }
}

function givePropertyValues(p_obj) {
    for (let prop in p_obj)
        console.log(p_obj[prop]);
}