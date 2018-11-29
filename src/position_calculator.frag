// Calculates everythingx

precision mediump float;

attribute float step;
uniform sampler2D u_image;
varying vec2 v_texCoord;

vec2 calculate_new_pos(vec2 pos){
    vec2 vel;

    // Here goes the vector field function
    vel.x = pos.x;
    vel.y = pos.y;

    return pos + vel * step;
}

void main(){
    vec4 pixel = texture2D(u_image, v_texCoord);

    // TODO: decode position from pixel values
    vec2 coord;

    vec2 new_pos = calculate_new_pos(coord);

    // TODO: encode new position into pixel
    vec4 new_pixel;

    gl_FragColor = new_pixel;
}