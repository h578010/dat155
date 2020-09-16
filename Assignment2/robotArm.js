"use strict";

let canvas;
let gl;
let program;
let cube;

// Parameters controlling the size of the Robot's arm
let BASE_HEIGHT      = 2.0;
let BASE_WIDTH       = 5.0;
let LOWER_ARM_HEIGHT = 5.0;
let LOWER_ARM_WIDTH  = 0.5;
let UPPER_ARM_HEIGHT = 5.0;
let UPPER_ARM_WIDTH  = 0.5;
let CLAW_WIDTH       = 0.25;
let CLAW_HEIGHT      = 1.5;

// Shader transformation matrices
let modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis
let Base = 0;
let LowerArm = 1;
let UpperArm = 2;
let LowerClaw = 3;
let UpperClaw = 4;
let Wrist = 5;

let theta= [40, -30, -50, 20, -30, 0];
let angle = 0;
let modelViewMatrixLoc;
let vBuffer, cBuffer;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);
    cube = new Cube(gl, program);
    cube.init();
    
    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
        console.log("base: " + event.target.value);
    };
    document.getElementById("slider2").onchange = function(event) {
         theta[1] = event.target.value;
         console.log("lower arm: " + event.target.value);
    };
    document.getElementById("slider3").onchange = function(event) {
         theta[2] =  event.target.value;
         console.log("upper arm: " + event.target.value);
    };
    document.getElementById("slider4").onchange = function(event) {
        let value = event.target.value;
        if (value < -0.5 * theta[4]) {
            value = -0.5 * theta[4];
        }
        theta[3] =  value;
        console.log("lower claw: " + event.target.value);
    };
    document.getElementById("slider5").onchange = function(event) {
        let value = event.target.value;
        if (value > 2 * theta[3]) {
            value = 2 * theta[3];
        }
        theta[4] =  -value;
        console.log("upper claw: " + event.target.value);
    };
    document.getElementById("slider6").onchange = function(event) {
        theta[5] =  event.target.value;
        console.log("claw angle: " + event.target.value);
    };

    render();
}

function base() {
    let s = scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    let instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);

    let t = mult(modelViewMatrix, instanceMatrix);
    cube.draw(t);
}

function upperArm() {
    let s = scale(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    let instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);

    let t = mult(modelViewMatrix, instanceMatrix);
    cube.draw(t);
}

function lowerArm() {
    let s = scale(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    let instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);

    let t = mult(modelViewMatrix, instanceMatrix);
    cube.draw(t);
}

function clawFinger() {
    let s = scale(CLAW_WIDTH, CLAW_HEIGHT, CLAW_WIDTH);
    let instanceMatrix = mult( translate(0.0, 0.5 * CLAW_HEIGHT, 0.0), s);

    let t = mult(modelViewMatrix, instanceMatrix);
    cube.draw(t);
}

let render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    modelViewMatrix = rotate(theta[Base], vec3(0, 1, 0 ));
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], vec3(0, 0, 1 )));
    lowerArm();

    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], vec3(0, 0, 1)) );
    upperArm();

    let wrist = mult(modelViewMatrix, rotate(theta[Wrist], vec3(0, 1, 0)));
    if (document.getElementById("box").checked) {
        theta[Wrist] += 1;
    }
    
    modelViewMatrix = mult(wrist, translate(0.125, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerClaw], vec3(0, 0, 1)));
    clawFinger();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, CLAW_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperClaw], vec3(0, 0, 1)));
    clawFinger();

    modelViewMatrix = mult(wrist, translate(-0.125, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(-theta[LowerClaw], vec3(0, 0, 1)));
    clawFinger();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, CLAW_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(-theta[UpperClaw], vec3(0, 0, 1)));
    clawFinger();

    requestAnimationFrame(render);
}
