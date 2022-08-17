// For mobile devices, of course:
precision mediump float;

attribute vec3 aPos;

void main () {
  vec4 pos =  vec4(aPos, 1.0);
  pos.xy = pos.xy * 2.0 - 1.0;
  gl_Position = pos;
}