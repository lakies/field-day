precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texCoord;

void main(){
    vec4 color = texture2D(u_image, v_texCoord);
    gl_FragColor = vec4(floor(255.0 * color * vec4(1.0, 1.0, 1.0, 0.995)) / 255.0);
}