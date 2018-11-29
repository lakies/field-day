// Take the framebuffer as an input and based on that take the position

uniform vec2 u_resolution;
attribute sampler2D a_image;
attribute vec2 a_location;


void main(){
    vec2 clipSpace = (texture2D(u_image, location) / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
    gl_PointSize = 1.0;
}