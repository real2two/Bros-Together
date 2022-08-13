// ALWAYS call the constructor (AKA use `new`), then modify properties:

let testScene = new Scene();

testScene.setup = function () {
    this.engine = Engine.create();
    //this.engine.velocityIterations = 10;
    //this.engine.positionIterations = 10;
    //this.engine.constraintIterations = 10;

    this.engine.gravity.scale = pow(10, -4); // Water.
    //this.engine.gravity.scale = pow(10, -3.7); // Soft Land.
    //this.engine.gravity.scale = pow(10, -3.5); // A bit too much.
    // Going any higher for the exponent may result in collisions missing.

    this.world = this.engine.world;
    this.bodies = [];
    //this.blocks[];

    this.cam = new Camera();
    this.cam.clearColor = color(0, 120);
    setCam(this.cam);

    // Put them "into the scene" like this.
    // The `.push()`-ing is automatic as long as there is a `bodies[]` or `blocks[]` :D
    this.player = createBlock(0, 0, 20, 20);
    this.player.grounded = false;
    this.player.firstJump = false;
    Body.setMass(this.player, 25);
    this.ground = createBlock(0, cy / 6, 768, 20, { isStatic: true, frictionStatic: 0.008 });

    //#region: Player Grounding.
    Events.on(this.engine, "collisionStart", function (p_event) {
        if (p_event.pairs.bodyA === this.player && p_event.pairs.bodyB === this.ground)
            testScene.player.grounded = true;
        else if (p_event.pairs.bodyA === this.ground && p_event.pairs.bodyB === this.player)
            testScene.player.grounded = true;
    });

    Events.on(this.engine, "collisionEnd", function (p_event) {
        if (p_event.pairs.bodyA === this.player && p_event.pairs.bodyB === this.ground) {
            testScene.player.firstJump = true;
            testScene.player.grounded = false;
        } else if (p_event.pairs.bodyA === this.ground && p_event.pairs.bodyB === this.player) {
            testScene.player.firstJump = true;
            testScene.player.grounded = false;
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

testScene.update = function () {
    Body.setAngle(this.player, 0);
    Body.setAngularVelocity(this.player, 0);

    // The user can switch tabs, but cannot change applications:
    if (!!focused && !!docFocus && !!winFocus && !!document.hasFocus())
        Engine.update(this.engine, deltaTime);

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

testScene.draw = function () {
    for (let b of this.bodies) {
        push();
        beginShape(TESS);
        for (let v of b.vertices)
            vertex(v.x, v.y);
        endShape(CLOSE);

        pop();
    }
};

testScene.drawUi = function () {
    // This function makes sure the text is on the corner:
    textOff(fps, 0, 0);
}

testScene.mousePressed = function () {
    //SOUNDS["rickroll"].play();
}

testScene.keyPressed = function name() {
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