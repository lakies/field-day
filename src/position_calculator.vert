// Pass through every pixel to frag shader

precision mediump float;

attribute float a_particle_index;
uniform float u_particles_resolution;
varying vec2 v_tex_pos;

void main() {
    v_tex_pos = vec2(fract(a_particle_index / u_particles_resolution), floor(a_particle_index / u_particles_resolution) / u_particles_resolution);
    gl_Position = vec4(1.0 - 2.0 * v_tex_pos, 0, 1);
}