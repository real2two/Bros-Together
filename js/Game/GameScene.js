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

    console.log("Frames:" + this.anim.frames);

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
    this.ground = createBlock(0, 72, 768, 20, {
        isStatic: true,
        // Useless! The friction is STILL a lot...
        frictionStatic: pow(8, -5)
    });

    //#region: Player Grounding.
    Events.on(this.engine, "collisionStart", function (p_event) {
        if (p_event.pairs.bodyA === this.player && p_event.pairs.bodyB === this.ground)
            gameScene.player.grounded = true;
        else if (p_event.pairs.bodyA === this.ground && p_event.pairs.bodyB === this.player)
            gameScene.player.grounded = true;
    });

    Events.on(this.engine, "collisionEnd", function (p_event) {
        if (p_event.pairs.bodyA === this.player && p_event.pairs.bodyB === this.ground) {
            gameScene.player.firstJump = true;
            gameScene.player.grounded = false;
        } else if (p_event.pairs.bodyA === this.ground && p_event.pairs.bodyB === this.player) {
            gameScene.player.firstJump = true;
            gameScene.player.grounded = false;
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
    // These are slow. Simply setting the inertia to `Infinity` is better.
    //Body.setAngle(this.player, 0);
    //Body.setAngularVelocity(this.player, 0);

    //#region Tab switch:
    // The user can switch tabs, but cannot change applications:
    if (!!focused && !!docFocus && !!winFocus && !!document.hasFocus())
        Engine.update(this.engine, deltaTime);

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
    //#endregion

    // `W` / jumping is handled in the `testScene.keyPressed()` function.
    // Here we handle the sides:
    if (keyIsDown(65))
        Body.applyForce(this.player, this.player.position, Vector.create(-0.01, 0));
    if (keyIsDown(68))
        Body.applyForce(this.player, this.player.position, Vector.create(0.01, 0));

    // `S` key:
    //if (keyIsDown(83))
    //Body.applyForce(this.player, this.player.position, Vector.create(0, 0.01));
}

//#region `gameScene.draw()`:
gameScene.draw = function () {
    for (let b of this.bodies) {
        push();
        beginShape(TESS);
        
        if (loadedBodies.includes(b)) {
            noFill();
            stroke(255)
        }
        
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
        let coords = `${mouseX - cx}, ${mouseY - cy}`;
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

gameScene.keyPressed = function name() {
    switch (keyCode) {
        case 87:
            if (this.player.grounded) {
                Body.applyForce(this.player, this.player.position, Vector.create(0, -0.3));
                this.player.firstJump = false;
            } else if (this.player.firstJump) {
                // Double jump:
                Body.applyForce(this.player, this.player.position, Vector.create(0, -0.28));
                this.player.firstJump = false;
            }
            break;

        case 82: // `R`
            console.log("Resetting...");
            Body.setPosition(this.player, { x: 0, y: 0 });
            Body.setVelocity(this.player, { x: 0, y: 0 });
            Body.setAngularVelocity(this.player, { x: 0, y: 0 });
            this.player.lastDeathPosition = this.player.position;
            break;

    }
}