// Calculates everythingx

precision mediump float;

uniform float u_step;
uniform float u_rand_seed;
uniform float frame;
uniform sampler2D u_image;
varying vec2 v_tex_pos;

const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);

float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

vec4 calculate_new_pos(vec2 p){
    vec2 v;
    p = p - vec2(0.5, 0.5);

    p = p * 10.0;
    // Here goes the vector field function

    // One version
//    v.x =  -2.0 * mod(floor(p.y * 10.0), 2.0) + 1.0;
//    v.y =  -2.0 * mod(floor(p.x * 10.0), 2.0) + 1.0;

// Second
//    v.x =  pow(abs(p.y / 10.0), abs(p.x / 10.0));
//    v.y =  cos(p.x * 2.0 / p.y / 10.0);

//v.x = p.y / log(p.y);
//  v.y = sin(p.x)*tan(p.y / mod(v.x, 2.0));
//
//  v.x = sin((max(p.y/p.x,p.x)-log(p.y)))/min(length(p),sin(sin(p.x)));
//  v.y = min(sin(p.y)/cos(p.x),pow(min(p.y/p.y,p.x), p.x)*p.y);
    {0}

    vec4 returned = vec4((p + v * u_step) / 10.0 + vec2(0.5, 0.5), v / 10.0);

    return returned;
}

void main(){
    vec4 pixel = texture2D(u_image, v_tex_pos);

    // Get particle's position based on the pixel color
    vec2 particle_position = vec2(
            pixel.r / 255.0 + pixel.b,
            pixel.g / 255.0 + pixel.a);
//    vec2 particle_position = vec2(0.0, 0.0);

    vec4 t = calculate_new_pos(particle_position);
    vec2 new_pos = t.xy;

    vec2 seed = (new_pos + v_tex_pos) * u_rand_seed;

    float drop_rate = 0.01 + length(t.zw) * 0.01;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(
            rand(seed + 1.3),
            rand(seed + 2.1));

    new_pos = mix(new_pos, random_pos, drop);
//    new_pos = random_pos;

    gl_FragColor = vec4(fract(new_pos * 255.0), floor(new_pos * 255.0) / 255.0);
}