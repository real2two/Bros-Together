function begin2D() {
    gl.disable(gl.DEPTH_TEST);
    push();
}

function end2D() {
    pop();
    gl.enable(gl.DEPTH_TEST);
}

// Clears the screen with an alpha color using `gl.disable(gl.DEPTH_TEST)`, `fill()` and `rect()`.
function backgroundA(p_color) {
    // "Leave this to me!" - @Brahvim
}