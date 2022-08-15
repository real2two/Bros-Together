// I wrote this on a phone a long time ago, which is why it looks so 'unformatted'.
// It was written in Java (with Processing), and yes, the `this.`s were here already, :D!
// Just had to remove the types and add a JS-compatible constructor.

class SineWave {
    constructor(p_freqMult, p_angleOffset) {
        // You're not supposed to access these:
        this.angleOffset = p_angleOffset ? radians(p_angleOffset) : 0;
        this.beginOffset = 0;
        this.freqMult = p_freqMult || 0;
        this.endFrame = Infinity;
        this.endFrameMinusOne = Infinity;

        // Right here! Public stuff!:
        this.useFrames = false;
        this.active = true;
        this.freq = 0;
    }

    endIn(p_frame) {
        this.useFrames = true;
        this.endFrame
            = frameCount + p_frame;
    }

    endWhenAngleAccumulatesTo(p_angle) {
        this.useFrames = true;

        this.endFrame
            = frameCount
            // In Java, it was casting. Here, it is done with `parseInt()`
            + parseInt((p_angle *
                (p_angle * this.freqMult)
                - this.angleOffset));

        this.endFrameMinusOne
            = this.endFrame - 1;
    }

    set(p_angleOffset) {
        this.angleOffset
            = radians(p_angleOffset || 0);
        this.beginOffset = this.useFrames ?
            frameCount : millis();
    }

    setFreqMult(p_freqMult) {
        this.freqMult = p_freqMult;
    }

    get() {
        if (frameCount == this.endFrameMinusOne)
            this.active = false;

        // No options for optimization
        // here, but hey, it's awesome!:
        if (frameCount < this.endFrame)
            return sin(this.freq
                = (((this.useFrames ?
                    frameCount : millis())
                    - this.beginOffset)
                    * this.freqMult
                    + this.angleOffset));

        return 0;
    }
}


  // Next Utility:
  // ...