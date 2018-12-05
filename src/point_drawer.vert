// Take the framebuffer as an input and based on that take the position
uniform sampler2D u_image;
uniform float u_particles_resolution;

attribute float a_particle_index;



void main(){
    // Get the color of the particle in question
    vec4 part = texture2D(u_image, vec2(fract(a_particle_index / u_particles_resolution), floor(a_particle_index / u_particles_resolution) / u_particles_resolution));

    // Get particle's position based on the pixel color
    vec2 particle_position = vec2(
            part.r / 255.0 + part.b,
            part.g / 255.0 + part.a);

    gl_PointSize = 1.5;
    gl_Position = vec4(1.0 - 2.0 * particle_position.x, 1.0 - 2.0 * particle_position.y, 0, 1);
}