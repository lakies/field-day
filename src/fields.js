//
// start here
//

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
    console.log(data);
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

function main(vert, frag, image) {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
    
    var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [];

    for(var i = 0; i < gl.canvas.width; i++){
        for(var u = 0; u < gl.canvas.height; u++){
            positions.push(i, u);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Process image image
    var img = genField(gl.canvas.width, gl.canvas.height);
    var texture = textureFromPixelArray(gl, img, gl.RGBA, gl.canvas.width, gl.canvas.height);

    // var fb = gl.createFramebuffer();
    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.drawArrays(gl.POINTS, 0, gl.canvas.width * gl.canvas.height);



    
}

$(document).ready(function(){
    var shaders = [];
    var shader_names = ["vertex-shader.vert", "fragment-shader.frag", "position_calculator.frag", "position_calculator.vert"];

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

        shaders.push(shader);
    });

    console.log("Shaders loaded");

    var img = new Image();
    img.src = "src/img.png";
    img.onload = function () {
        main(shaders[0], shaders[1], img);
    };

});