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

function setupFrame(gl, vert, frag, frameSize){
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



function main(vert, frag) {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    console.log(vert);
    console.log(frag);

    var frame = setupFrame(gl, vert, frag, {
        "x" : gl.canvas.width,
        "y" : gl.canvas.height
    });

    gl.useProgram(frame.program);

    gl.uniform2f(frame.uniforms[0], gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, frame.buffer);

    gl.enableVertexAttribArray(frame.attrs[0]);

    gl.vertexAttribPointer(frame.attrs[0], 2, gl.FLOAT, false, 0, 0);

    // Process image image
    var img = genField(gl.canvas.width, gl.canvas.height);
    var texture = textureFromPixelArray(gl, img, gl.RGBA, gl.canvas.width, gl.canvas.height);

    var fb = gl.createFramebuffer();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.POINTS, 0, gl.canvas.width * gl.canvas.height);

    // setInterval(function () {
    //     console.log("hi");
    //     img = genField(gl.canvas.width, gl.canvas.height);
    //     texture = textureFromPixelArray(gl, img, gl.RGBA, gl.canvas.width, gl.canvas.height);
    // }, 1000/60)

}




$(document).ready(function(){
    let parent = $("#glCanvas").parent();
    // $("#glCanvas").width(parent.width());
    // $("#glCanvas").height(parent.height());

    var shaders = [];
    var shader_names = ["vertex-shader.vert", "fragment-shader.frag", "position_calculator.frag", "position_calculator.vert", "point_drawer.frag", "point_drawer.vert"];
    var shader_attributes = [
        ["a_position"], //vertex-shader.vert
        [], //fragment-shader.frag
        [], //position_calculator.frag
        [], //position_calculator.vert
        [], //point_drawer.frag
        ["a_image", "a_location"]  //point_drawer.vert
    ];

    var shader_uniforms = [
        ["u_resolution"], //vertex-shader.vert
        [], //fragment-shader.frag
        [], //position_calculator.frag
        [], //position_calculator.vert
        [], //point_drawer.frag
        ["u_resolution"]  //point_drawer.vert
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

    main(shaders[0], shaders[1]);

});