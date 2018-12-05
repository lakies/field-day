// Calculates everythingx

precision mediump float;

uniform float u_step;
uniform sampler2D u_image;
varying vec2 v_tex_pos;

vec2 calculate_new_pos(vec2 pos){
    vec2 vel;

    // Here goes the vector field function
    vel.x = sin(pos.x) / 5.0;
    vel.y = cos(pos.y) / 5.0;

    return pos + vel * u_step;
}

void main(){
    vec4 pixel = texture2D(u_image, v_tex_pos);

    // Get particle's position based on the pixel color
    vec2 particle_position = vec2(
            pixel.r / 255.0 + pixel.b,
            pixel.g / 255.0 + pixel.a);
//    vec2 particle_position = vec2(0.0, 0.0);

    vec2 new_pos = calculate_new_pos(particle_position);

    gl_FragColor = vec4(fract(new_pos * 255.0), floor(new_pos * 255.0) / 255.0);
}