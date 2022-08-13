let CAMERAS = [];
let currentCam, lerpeable; // `lerpeable` is allocated all the time during lerps, don't do that right now.
let camIsLerp = false;
let camLerpAmt;

function setCam(p_camera) {
    currentCam = p_camera;
}

function startCamLerp(p_from, p_to) {
    //camIsLerp = true; // If you're gunna call `camerLerpUpdate()` anyway, why this?
    camToLerpFrom = p_from;
    camToLerpTo = p_to;
}

function updateCam() {
    if (currentCam != null) {
        if (currentCam.script != null)
            currentCam.script(currentCam);
        currentCam.applyMatrix();
    }
}

function updateCam(p_cam) {
    if (p_cam != null)
        if (p_cam.script != null)
            p_cam.script(p_cam);
}

function camLerpUpdate(p_from, p_to, p_lerpAmt) {
    camLerpUpdate(p_from, p_to, p_lerpAmt, 0, 1);
}

function camLerpUpdate(p_from, p_to, p_lerpAmt, p_start, p_stop) {
    camIsLerp = true;
    // Update both cameras:
    updateCam(p_from);
    updateCam(p_to);

    if (p_lerpAmt > p_stop) {
        setCam(p_to);
        lerpeable.clearColor = color(red(p_to.clearColor),
            green(p_to.clearColor), blue(p_to.clearColor), 255);
        lerpeable.clear();
        p_to.applyMatrix();
        camIsLerp = false;
        return;
    } else if (p_lerpAmt < p_start) {
        setCam(p_from);
        lerpeable.clearColor = color(red(p_from.clearColor),
            green(p_from.clearColor), blue(p_from.clearColor), 255);
        lerpeable.clear();
        p_from.applyMatrix();
        camIsLerp = false;
        return;
    }

    // Set the current settings to the lerping camera's:
    lerpeable = p_from.copy();

    // Lerp!:

    // "HERE YOU GO >:("
    lerpeable.up.x = p_from.up.x + (p_to.up.x - p_from.up.x) * p_lerpAmt;
    lerpeable.up.y = p_from.up.y + (p_to.up.y - p_from.up.y) * p_lerpAmt;
    lerpeable.up.z = p_from.up.z + (p_to.up.z - p_from.up.z) * p_lerpAmt;

    lerpeable.center.x = p_from.center.x + (p_to.center.x - p_from.center.x) * p_lerpAmt;
    lerpeable.center.y = p_from.center.y + (p_to.center.y - p_from.center.y) * p_lerpAmt;
    lerpeable.center.z = p_from.center.z + (p_to.center.z - p_from.center.z) * p_lerpAmt;

    lerpeable.pos.x = p_from.pos.x + (p_to.pos.x - p_from.pos.x) * p_lerpAmt;
    lerpeable.pos.y = p_from.pos.y + (p_to.pos.y - p_from.pos.y) * p_lerpAmt;
    lerpeable.pos.z = p_from.pos.z + (p_to.pos.z - p_from.pos.z) * p_lerpAmt;

    // Remember: if your FOV changes, the `z` position of the camera must, as well.
    lerpeable.fov = p_from.fov + (p_to.fov - p_from.fov) * p_lerpAmt;
    lerpeable.far = p_from.far + (p_to.far - p_from.far) * p_lerpAmt;
    lerpeable.near = p_from.near + (p_to.near - p_from.near) * p_lerpAmt;
    lerpeable.clearColor = lerpColor(p_from.clearColor, p_to.clearColor, p_lerpAmt);

    //lerpeable.apply(); // ...?!
    lerpeable.clear();
    lerpeable.applyMatrix();
}

class Camera {
    constructor() {
        this.pos = new p5.Vector(0, 0, 300);
        this.center = new p5.Vector(0, 0, 0);
        this.up = new p5.Vector(0, 1, 0);

        this.fov = 60 * Math.PI / 180;
        this.near = 0.01;
        this.far = 10000;

        this.script = null; // Holds a 'script'. Don't complain about `null` for now.
        this.clearColor = null; // :(

        CAMERAS.push(this);
    }

    apply() {

        // This was made for clearing the background with an alpha for effects.
        // Do it yourself now LOL. Made a function for it.

        begin2D();
        fill(this.clearColor);
        noStroke();
        //rect(-width * 2.5f, -height * 2.5f, width * 7.5f, height * 7.5f);
        rect(0, 0, width, height);
        end2D();

        if (this.script != null)
            this.script(this);

        perspective(this.fov, width / height, this.near, this.far);
        camera(this.pos.x, this.pos.y, this.pos.z,
            this.center.x, this.center.y, this.center.z,
            this.up.x, this.up.y, this.up.z);
    }

    update() {
        if (this.script != null)
            this.script(this);
    }

    clear() {
        begin2D();
        camera(); // Removing this will not display the previous camera's view, but still show clipping.
        rectMode(CORNER);
        noStroke();
        fill(this.clearColor);
        //rect(-width * 2.5f, -height * 2.5f, width * 7.5f, height * 7.5f);
        rect(0, 0, width, height);
        end2D();
    }

    applyMatrix() {
        perspective(this.fov, width / height, this.near, this.far);
        camera(this.pos.x, this.pos.y, this.pos.z,
            this.center.z, this.center.y, this.center.z,
            this.up.x, this.up.y, this.up.z);
        // translate(-cx, -cy);
    }

    reset() {
        this.up = new PVector(0, 1, 0);
        this.center = new PVector(cx, cy, 0);
        this.pos = new PVector(cx, cy, 300);
        this.fov = radians(60);
        this.near = 0.1;
        this.far = 10000;
    }

    copy() {
        let ret = new Camera(this.pos, this.center, this.up, this.fov, this.near, this.far);
        ret.script = this.script;
        return ret;
    }
}