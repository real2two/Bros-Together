// ALWAYS call the constructor (AKA use `new`), then modify properties:

let testScene = new Scene();

testScene.setup = function () {
    testScene.engine = Matter.Engine.create();
    testScene.cam = new Camera();
    this.cam.clearColor = color(0);

    // "Camera scripts" are functions that get a `Camera` as a parameter.
    // You modify the properties of the camera YOU RECEIVE, so the functionality can be transferred over.

    //this.cam.script = function name(p_cam) {}
}

testScene.draw = function () {
    this.cam.apply();

    push();
    rotateY(millis() * 0.001);
    rotateZ(millis() * 0.001);
    box(45);
    pop();

};

testScene.drawUi = function () {
    textOff(fps, 0, 0);
}