class Animator {
    constructor(p_sprSheet, p_x, p_y) {
        this.frames = []; // Frame data.

        for (let spr of p_sprSheet.sprites) {
            console.log(spr);
            this.frames.push(spr);
        }

        this.beginFrame = -1;
        this.fid = -1; // "Frame ID".
        this.endFrame = -1;

        // Playback control:
        this.paused = false;

        this.x = p_x || 0;
        this.y = p_y || 0;

        //currentScene.ANIMATIONS.push(this);
    }

    begin() {
        this.beginFrame = frameCount;
        this.endFrame = this.frameCount + this.frames.length;
    }

    draw(p_x, p_y, p_sx, p_sy) {
        if (!this.paused) {
            // If you return `fid` JUST to make a one-liner,
            // it'll have to do the extra hard work of passing a pointer.
            this.fid++;
            return;
        }

        const frame = this.frames[this.fid];

        if (frame)
            image(frame,
                p_x || this.x, p_y || this.y,
                p_sx || frame.width, p_sy || frame.height);
        else
            console.warn("Animation is null!");
    }

    pause() {
        this.paused = true;
    }

    continue() {
        this.paused = false;
    }
}