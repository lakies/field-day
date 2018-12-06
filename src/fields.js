var interestingFuncs = [
    `float r = length(p);
float theta = atan(p.y, p.x);
v = vec2(p.y, -p.x) / r;
float t = sqrt(r * 10.) + theta + frame * .02;
v *= sin(t);
v *= length(v) * 10.;
v += p * .2;`,
`p = p / 10.0;
float a = sin(frame*0.05 - length(p)*4.0);

float b = sin(a);
float c = cos(a);

b = b*b*b;
c = c*c*c*c;

v.x = (-p.y*b 
- 0.8*p.x*(c))/(4.0*length(p));

v.y = (p.x*b  
- 0.8*p.y*(c))/(4.0*length(p));

v = v * 10.0;
p = p * 10.0;
`,
"v.x = p.y;\nv.y = sin(sin(max(length(p),p.x*p.x))*p.x);",
    "v.x =  -2.0 * mod(floor(p.y * 10.0), 2.0) + 1.0;\nv.y =  -2.0 * mod(floor(p.x * 10.0), 2.0) + 1.0;",
    "v.x = sin((exp(length(p)/cos(p.y))+max(p.y,(p.y+p.x))));\nv.y = sin((p.x-min(sin(p.y),length(p)))*(max(length(p),p.x*sin(p.y))-p.y));",
    ` float w = p.y - cos(p.x);
float u = 2.*exp(-pow(w,2.));
v.y = (-2.*w)*sin(p.x)*exp(-pow(p.y,2.));
v.x = -(-2.*w);
v = 0.5*v/w*exp(u);
`
];

console.log(interestingFuncs.length);


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
    var dataTypedArray = dataArray ? new Uint8Array(dataArray) : null;
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, dataTypedArray);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

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

function setupAttrib(gl, program, size){
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);
    gl.enableVertexAttribArray(program.attrs.a_particle_index);
    gl.vertexAttribPointer(program.attrs.a_particle_index, size, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function setupProgram(gl, vert, frag){
    var vertexShader = vert.compiledShader;
    var fragmentShader = frag.compiledShader;
    var program = createProgram(gl, vertexShader, fragmentShader);

    var attributeLocations = {};
    var uniformLocations = {};

    let attrNames = vert.attrs.concat(frag.attrs);
    let uniformNames = vert.uniforms.concat(frag.uniforms);

    for(let i in attrNames){
        attributeLocations[attrNames[i]] = (gl.getAttribLocation(program, attrNames[i]));
    }

    for(let i in uniformNames){
        uniformLocations[uniformNames[i]] = (gl.getUniformLocation(program, uniformNames[i]));
    }

    console.log(uniformLocations);

    // All pixel coordinates
    var positionBuffer = gl.createBuffer();

    // Set clear color to black, fully opaque
    gl.clearColor(0.0745, 0.1607, 0.30980392156, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
        "program" : program,
        "attrs" : attributeLocations,
        "uniforms" : uniformLocations,
        "buffer" : positionBuffer
    }
}

function updateParticles(gl, updater, res, frame, frameCounter){
    gl.useProgram(updater.program.program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, updater.fb);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frame.curr, 0);

    gl.viewport(0, 0, res, res);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    setupAttrib(gl, updater.program, 1);

    gl.uniform1f(updater.program.uniforms.u_particles_resolution, res); // u_particles_resolution
    gl.uniform1f(updater.program.uniforms.u_step, 0.005); // u_step
    gl.uniform1f(updater.program.uniforms.u_rand_seed, Math.random());
    gl.uniform1f(updater.program.uniforms.frame, frameCounter);

    gl.bindTexture(gl.TEXTURE_2D, frame.prev);

    gl.drawArrays(gl.POINTS, 0, res * res);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var temp = frame.prev;
    frame.prev = frame.curr;
    frame.curr = temp;

}

function drawParticles(gl, drawer){
    gl.useProgram(drawer.program.program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, drawer.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, drawer.tex.drawn, 0);

    setupAttrib(gl, drawer.program, 1);

    // u_particles_resolution
    gl.uniform1f(drawer.program.uniforms.u_particles_resolution, drawer.resolution);

    // u_image
    gl.bindTexture(gl.TEXTURE_2D, drawer.tex.prev);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.clearColor(0.0745, 0.1607, 0.30980392156, 0.2);

    gl.drawArrays(gl.POINTS, 0, drawer.count);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}

function drawDisplay(gl, displayer, texture){
    gl.useProgram(displayer.program.program);
    setupAttrib(gl, displayer.program, 2);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function fadeFrame(gl, fader, texture){
    gl.useProgram(fader.program.program);

    setupAttrib(gl, fader.program, 2);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fader.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fader.frame, 0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}

function setupDrawer(gl, particle_shaders){
    var particle_drawer = setupProgram(gl, particle_shaders[0], particle_shaders[1]);

    var n_particles = 10000;
    // The number of particles is a perfect square, this is the side length of it
    var particles_resolution = Math.ceil(Math.sqrt(n_particles));

    // Recalculate particle count to be a square
    n_particles = particles_resolution * particles_resolution;

    var particle_positions = new Float32Array(n_particles);
    for(var i = 0; i < n_particles; i++){
        particle_positions[i] = i;
    }

    // Particle index attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, particle_drawer.buffer);

    gl.bufferData(gl.ARRAY_BUFFER, particle_positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Generate an initial particle position texture
    var img = genField(particles_resolution, particles_resolution);
    var texture = textureFromPixelArray(gl, img, gl.RGBA, particles_resolution, particles_resolution);
    var frameBufferTargetTexture = textureFromPixelArray(gl, null, gl.RGBA, particles_resolution, particles_resolution);
    var drawnFrame = textureFromPixelArray(gl, null, gl.RGBA, gl.canvas.width, gl.canvas.height);

    var fb = gl.createFramebuffer();

    return {
        "program" : particle_drawer,
        "resolution" : particles_resolution,
        "tex" : {
            "curr" : frameBufferTargetTexture, // this is set every frame by the updater
            "prev" : texture,
            "drawn" : drawnFrame
        },
        "count" : n_particles,
        "fb" : fb
    }
}

function setupUpdater(gl, shaders, res){
    var position_updater = setupProgram(gl, shaders[0], shaders[1]);

    // Somehow the attribute index getting doesnt work properly
    // position_updater.attrs[0]++;

    gl.bindBuffer(gl.ARRAY_BUFFER, position_updater.buffer);

    var count = res * res;
    var particle_positions = new Float32Array(count);
    for(var i = 0; i < count; i++){
        particle_positions[i] = i;
    }

    gl.bufferData(gl.ARRAY_BUFFER, particle_positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var fb = gl.createFramebuffer();

    return {
        "program" : position_updater,
        "fb" : fb,
        "res" : res
    }
}

function setupDisplay(gl, shaders){
    var display = setupProgram(gl, shaders[0], shaders[1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, display.buffer);
    var positions = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        "program" : display
    }
}

function setupFader(gl, shaders){
    var fader = setupProgram(gl, shaders[0], shaders[1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, fader.buffer);
    var positions = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    var fb = gl.createFramebuffer();
    var fadedFrame = textureFromPixelArray(gl, null, gl.RGBA, gl.canvas.width, gl.canvas.height);

    return {
        "program" : fader,
        "fb" : fb,
        "frame" : fadedFrame
    }

}


function main(shaders = []) {
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

    // Create shaders
    for(var i = 0; i <= 6; i++){
        let type = i % 2 === 0 ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER;
        shaders[i].compiledShader = createShader(gl, type, shaders[i].shader)
    }

    console.log("Shaders created");

    // var frame = setupProgram(gl, vert, frag, {
    //     "x" : gl.canvas.width / 2,
    //     "y" : gl.canvas.height / 2
    // });

    var drawer = setupDrawer(gl, [shaders[5], shaders[4]]);
    var updater = setupUpdater(gl, [shaders[3], shaders[2]], drawer.resolution);
    var display = setupDisplay(gl, [shaders[0], shaders[1]]);
    var fader = setupFader(gl, [shaders[6], shaders[1]]);
    console.log("Starting main loop");

    // Draw first frame and set the texture to a global variable
    // drawParticles(gl, drawer);

    var frameCounter = 0;

    // console.log(updater);
    // updateParticles(gl, updater, drawer.resolution, drawer.tex);
    // drawParticles(gl, drawer);

    return setInterval(function () {
        // gl.disable(gl.DEPTH_TEST);
        // gl.disable(gl.STENCIL_TEST);
        // gl.bindTexture(gl.TEXTURE_2D, drawer.tex.prev);

        updateParticles(gl, updater, drawer.resolution, drawer.tex, frameCounter);

        drawParticles(gl, drawer);


        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        drawDisplay(gl, display, drawer.tex.drawn);
        // gl.disable(gl.BLEND);

        fadeFrame(gl, fader, drawer.tex.drawn);

        var temp = drawer.tex.drawn;
        drawer.tex.drawn = fader.frame;
        fader.frame = temp;

        frameCounter++;

    }, 1000 / 60);


}


$(document).ready(function(){

    var shaders = [];
    var shader_names = ["fragment-shader.frag","vertex-shader.vert", "position_calculator.frag", "position_calculator.vert", "point_drawer.frag", "point_drawer.vert", "fading_shader.frag"];
    var shader_attributes = [
        [], //fragment-shader.frag
        [], //vertex-shader.vert
        [], //position_calculator.frag
        ["a_particle_index"], //position_calculator.vert
        [], //point_drawer.frag
        ["a_particle_index"],  //point_drawer.vert
        [] //fading_shader.frag
    ];

    var shader_uniforms = [
        [], //fragment-shader.frag
        ["u_resolution"], //vertex-shader.vert
        ["u_step", "u_rand_seed", "frame", "u_image"], //position_calculator.frag
        ["u_particles_resolution"], //position_calculator.vert
        [], //point_drawer.frag
        ["u_image", "u_particles_resolution"],  //point_drawer.vert
        [] //fading_shader.frag
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

    var lastField = `v.x = p.y;
v.y = -p.x;`;
    var newField;

    shaders[2].shader = shaders[2].shader.replace("{0}", lastField);

    $("textarea").val(lastField);


    var timer = main(shaders);

    $("#enter").click(function () {
        clearInterval(timer);
        newField = $("textarea").val();
        shaders[2].shader = shaders[2].shader.replace(lastField, newField);
        lastField = newField;
        timer = main(shaders);
    });

    $("#random").click(function () {
        clearInterval(timer);
        newField = generate();
        $("textarea").val(newField);
        shaders[2].shader = shaders[2].shader.replace(lastField, newField);
        lastField = newField;
        timer = main(shaders);
    });

    $("#setDisplay").click(function () {
        if($("#hide").css("display") === "none"){
            $("#hide").css("display","");
        }else{
            $("#hide").css("display","none");
        }
    });

    $(".func").click(function () {
        clearInterval(timer);
        newField = interestingFuncs[this.id[this.id.length - 1]];
        $("textarea").val(newField);
        shaders[2].shader = shaders[2].shader.replace(lastField, newField);
        lastField = newField;
        timer = main(shaders);
    });


});



