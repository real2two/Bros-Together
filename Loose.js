function begin2D() {
    gl.disable(gl.DEPTH_TEST);
    push();
}

function end2D() {
    pop();
    gl.enable(gl.DEPTH_TEST);
}

function background(p_color) {

}