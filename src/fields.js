//
// start here
//


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

function main(vert, frag) {
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

    var positions = [
        10, gl.canvas.height,
        0, 200,
        50, 50
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    //
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

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

    var counter = 0;

    setInterval(function () {
        var positions = [
            (Math.sin(counter / 10) * 0.5 + 0.5) * gl.canvas.width, counter,
            0, 0,
            (gl.canvas.width     - counter) % gl.canvas.width, 50
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        counter = (counter + 1) % gl.canvas.height;
    }, 1000/ 60);



    
}

$(document).ready(function(){
    var vs, fs;

    // $.get("src/fragment-shader.frag", function (data) {
    //     fs = data;
    //     console.log(fs);
    // });
    //
    // $.get("src/vertex-shader.vert", function (data) {
    //     vs = data;
    //     console.log(vs);
    // });
    //

    $.ajax({
        url: "src/vertex-shader.vert",
        success: function (data) {
            vs = data;
        },
        async : false
    });

    $.ajax({
        url: "src/fragment-shader.frag",
        success: function (data) {
            fs = data;
        },
        async : false
    });

    console.log(vs);
    console.log(fs);

    main(vs, fs);
    // $(document).click(function (evt) {
    //     debugger;
    // });
});