attribute vec2 a_position;
varying vec2 v_texCoord;

void main(){

    vec2 clipSpace = a_position * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
    vec2 texCoord = (clipSpace * vec2(1, -1) + 1.0) / 2.0;
    v_texCoord = texCoord;
}