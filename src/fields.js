function genField(x, y){
    let data = [];

    for(var i = 0; i < x; i++){
        for(var u = 0; u < y; u++){
            var a = Math.random() * 256;
            data.push(Math.floor(a), (a - Math.floor(a)) * 256);

            var b = Math.random() * 256;
            data.push(b, (b - Math.floor(b)) * 256);
        }
    }
    return new Uint8Array(data);
}

function textureFromPixelArray(gl, dataArray, type, width, height) {
    var dataTypedArray = new Uint8Array(dataArray);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, dataTypedArray);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}


function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function setupProgram(gl, vert, frag, frameSize){
    // Variables: gl,
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vert.shader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag.shader);
    var program = createProgram(gl, vertexShader, fragmentShader);

    var attributeLocations = [];
    var uniformLocations = [];

    let attrNames = vert.attrs.concat(frag.attrs);
    let uniformNames = vert.uniforms.concat(frag.uniforms);

    for(let i in attrNames){
        // console.log(i);
        attributeLocations.push(gl.getAttribLocation(program, attrNames[i]));
    }

    for(let i in uniformNames){
        console.log(i);
        uniformLocations.push(gl.getUniformLocation(program, uniformNames[i]));
    }

    // All pixel coordinates
    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [];

    for(let i = 0; i < frameSize.x; i++){
        for(let u = 0; u < frameSize.y; u++){
            positions.push(i, u);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
        "program" : program,
        "attrs" : attributeLocations,
        "uniforms" : uniformLocations,
        "buffer" : positionBuffer
    }
}

function updateParticles(particlePositions){

}

function drawParticles(particlePositions){

}


function main(vert, frag, particle_shaders = []) {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    gl.canvas.width = $("#glCanvas").width();
    gl.canvas.height = $("#glCanvas").height();

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    console.log(gl.canvas.width);
    console.log(gl.canvas.height);

    var frame = setupProgram(gl, vert, frag, {
        "x" : gl.canvas.width / 2,
        "y" : gl.canvas.height / 2
    });

    var fb = gl.createFramebuffer();

    // gl.useProgram(frame.program);
    //
    // gl.uniform2f(frame.uniforms[0], gl.canvas.width, gl.canvas.height);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, frame.buffer);
    //
    // var positions = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
    //
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    //
    // gl.enableVertexAttribArray(frame.attrs[0]);
    //
    // gl.vertexAttribPointer(frame.attrs[0], 2, gl.FLOAT, false, 0, 0);

    var n_particles = 10000;
    // The number of particles is a perfect square, this is the side length of it
    var particles_resolution = Math.ceil(Math.sqrt(n_particles));

    // Recalculate particle count to be a square
    n_particles = n_particles * n_particles;

    // Generate an initial particle position texture
    var img = genField(particles_resolution, particles_resolution);
    var texture = textureFromPixelArray(gl, img, gl.RGBA, particles_resolution, particles_resolution);

    console.log(particle_shaders[1], particle_shaders[0]);
    var particle_drawer = setupProgram(gl, particle_shaders[1], particle_shaders[0], {
        "x" : gl.canvas.width / 2,
        "y" : gl.canvas.height / 2
    });

    gl.useProgram(particle_drawer.program);

    // u_particles_resolution
    gl.uniform1f(particle_drawer.uniforms[1], particles_resolution);

    // Particle index attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, particle_drawer.buffer);

    var particle_positions = new Float32Array(n_particles);
    for(var i = 0; i < n_particles; i++){
        particle_positions[i] = i;
    }

    gl.bufferData(gl.ARRAY_BUFFER, particle_positions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(particle_drawer.attrs[0]);

    gl.vertexAttribPointer(particle_drawer.attrs[0], 1, gl.FLOAT, false, 0, 0);

    // u_image
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.POINTS, 0, n_particles);


}




$(document).ready(function(){

    var shaders = [];
    var shader_names = ["vertex-shader.vert", "fragment-shader.frag", "position_calculator.frag", "position_calculator.vert", "point_drawer.frag", "point_drawer.vert"];
    var shader_attributes = [
        ["a_position"], //vertex-shader.vert
        [], //fragment-shader.frag
        [], //position_calculator.frag
        [], //position_calculator.vert
        [], //point_drawer.frag
        ["a_particle_index"]  //point_drawer.vert
    ];

    var shader_uniforms = [
        ["u_resolution"], //vertex-shader.vert
        [], //fragment-shader.frag
        [], //position_calculator.frag
        [], //position_calculator.vert
        [], //point_drawer.frag
        ["u_image", "u_particles_resolution"]  //point_drawer.vert
    ];

    // Load shaders
    shader_names.forEach(e => {
        let shader;

        $.ajax({
            url: "src/" + e,
            success: function (data) {
                shader = data;
            },
            async : false
        });

        shaders.push({
            "shader" : shader,
            "attrs" : shader_attributes[shader_names.indexOf(e)],
            "uniforms" : shader_uniforms[shader_names.indexOf(e)]
        });
    });

    console.log("Shaders loaded");

    main(shaders[0], shaders[1], [shaders[4], shaders[5]]);

});