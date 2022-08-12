// ALWAYS call the constructor (AKA use `new`), then modify properties:

let testScene = new Scene();

testScene.setup = function () {
    testScene.cam = new Camera();
    this.cam.clearColor = color(0);

    // "Camera scripts" are functions that get a `Camera` as a parameter.
    // You modify the properties of the camera YOU RECEIVE, so the functionality can be transferred over.
    this.cam.script = function name(p_cam) {
    }
}

testScene.draw = function () {
    this.cam.apply();

    background(0); // Camera clear fix.

    push();
    rotateY(millis() * 0.001);
    rotateZ(millis() * 0.001);
    box(45);
    pop();

};


// Broken...
testScene.drawUI = function () {
    text(frameRate(), textWidth(frameRate()), 40, 40);
}