let titleScene = new Scene();

titleScene.setup = function () {
    this.cam = new Camera();
    this.cam.clearColor = color(245);
    setCam(this.cam);

    this.playBtn = {
        x: 0,
        y: 0,
        w: 150,
        h: 50,
        alpha: 0,
        hovered: false,
        phovered: false,
        exitStart: 0,
        exitStarted: false,
    };
    SOUNDS["Title"].loop();
}

titleScene.update = function () {
    if (this.playBtn.exitStarted) {
        if (millis() > this.playBtn.exitStart + 1000 * PI / 2)
            setScene(gameScene);
        this.playBtn.alpha = sin((millis() - this.playBtn.exitStart) * 0.001) * 255;
        this.cam.clearColor = color(255 - this.playBtn.alpha);
        return;
    } else {
        this.playBtn.y = Math.sin(millis() * 0.0018) * 12.5;
        if (
            mouseX > cx + this.playBtn.x - this.playBtn.w * 1.25 &&
            mouseX < cx + this.playBtn.x + this.playBtn.w * 1.25 &&
            mouseY > cy + this.playBtn.y - this.playBtn.h * 1.25 &&
            mouseY < cy + this.playBtn.y + this.playBtn.h * 1.25) {
            this.playBtn.hovered = true;
        }

        this.playBtn.phovered = this.playBtn.hovered;
    }
}

titleScene.draw = function () {
    stroke(0);

    imageMode(CENTER);
    image(SPRITES['bg'].sheet, 0, 0);

    fill(0, this.playBtn.exitStarted ? this.playBtn.alpha : 0);

    translate(this.playBtn.x, this.playBtn.y);

    fill(0);
    textSize(16);
    text("Click To Begin.", 0, 0);
}

titleScene.mouseClicked = function () {
    //if (this.playBtn.hovered && !this.playBtn.exitStarted) {
        this.playBtn.exitStart = millis();
        this.playBtn.exitStarted = true;
    //}

}