// Pass through every pixel to frag shader

attribute vec2 a_position;

uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main(){

    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
    gl_PointSize = 1.0;
    vec2 texCoord = (clipSpace * vec2(1, -1) + 1.0) / 2.0;
    v_texCoord = texCoord;
}