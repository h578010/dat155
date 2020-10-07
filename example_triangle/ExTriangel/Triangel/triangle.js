"use strict";

var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    /* Load the data into the GPU*/

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    render();
    window.addEventListener('resize', function(e){
        render();
    });
}

function render() {
    resize(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function resize(gl) {
    var canvas = gl.canvas;

    var aspectRatio =  window.innerWidth/window.innerHeight;
    var displayWidth = window.innerWidth;     // read only - width of the viewport
    var displayHeight = window.innerHeight;   //read only - height of the viewport

    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        if (displayWidth < displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight*aspectRatio;
        } else {
            canvas.width =  displayWidth/aspectRatio;
            canvas.height = displayHeight;
        }

     gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

function resize2(gl) {
    // Get the canvas from the WebGL context
    var canvas = gl.canvas;

    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    var aspectRatio =  canvas.clientWidth/canvas.clientHeight;

    // Check if the canvas is not the same size.

    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        if (displayWidth < displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight*aspectRatio;
        } else {
            canvas.width =  displayWidth/aspectRatio;
            canvas.height = displayHeight;
        }

        // Set the viewport to match
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}
