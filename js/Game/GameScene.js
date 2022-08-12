// ALWAYS call the constructor (AKA use `new`), then modify properties:

let testScene = new Scene();

testScene.setup = function () {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();
    this.bodies = [];

    this.cam = new Camera();
    this.cam.clearColor = color(0);

    this.blocks = [];
    this.blocks.push(new Block(0, 0, 20, 20));

    // "Camera scripts" are functions that get a `Camera` as a parameter.
    // You modify the properties of the camera YOU RECEIVE, so the functionality can be transferred over.

    //this.cam.script = function name(p_cam) {}
}

testScene.draw = function () {
    Matter.Runner.run(this.runner, this.engine);
    this.cam.apply();

    // translate(-cx, -cy);
    for (let b of this.bodies) {
        console.log(b.position);
        push();
        translate(b.position.x, b.position.y);
        rotateZ(b.angle);

        beginShape(TESS);
        for (let v of b.vertices)
            vertex(v.x, v.y);
        endShape(CLOSE);

        pop();
    }

    push();
    rotateY(millis() * 0.001);
    rotateZ(millis() * 0.001);
    box(45);
    pop();

};

testScene.drawUi = function () {
    // This function makes sure the text is on the corner:
    textOff(fps, 0, 0);
}