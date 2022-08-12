function begin2D() {
    gl.disable(gl.DEPTH_TEST);
    push();
}

function end2D() {
    pop();
    gl.enable(gl.DEPTH_TEST);
}

function textOff(p_str, p_xoff, p_yoff) {
    text(p_str, textWidth(p_str) + p_xoff, p_yoff + 2 * textAscent(p_str) - textDescent(p_str));
}