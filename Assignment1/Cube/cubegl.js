"use strict";

// Define rotation types
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
let gl;

// Needed because of a GL callback for rendering
let view;

/**
 * Initialise webGL for the cube.
 */
class CubeGL {

    /**
     * Initialisation code.
     *
     * @param model
     */
    constructor(model) {
        this._model = model;
        this.axis = X_AXIS;

        let canvas = document.getElementById("gl-canvas");

        this.theta = [0, 0, 0];
        this.numVertices = 36;
        
        gl = canvas.getContext('webgl2');
        this._gl = gl;
        if (!gl) {
            alert("WebGL 2.0 isn't available");
        }
        this.scale1 = mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);

        this.trans1 = mat4(
            1, 0, 0, 0,
            0, 1, 0, -0.5,
            0, 0, 1, 0,
            0, 0, 0, 1);

        this.scale2 = mat4(
            0.5, 0, 0, 0,
            0, 0.5, 0, 0,
            0, 0, 0.5, 0,
            0, 0, 0, 1);

        this.trans2 = mat4(
            1, 0, 0, 0,
            0, 1, 0, 0.5,
            0, 0, 1, 0,
            0, 0, 0, 1);

        this.scale3 = mat4(
            0.25, 0, 0, 0,
            0, 0.25, 0, 0,
            0, 0, 0.25, 0,
            0, 0, 0, 1);
        
        this.trans3 = mat4(
            1, 0, 0, 0,
            0, 1, 0, 2.5,
            0, 0, 1, 0,
            0, 0, 0, 1);

        this.globalScale = mat4(
            0.75, 0, 0, 0,
            0, 0.75, 0, 0,
            0, 0, 0.75, 0,
            0, 0, 0, 1);

        let indices = [
            [1, 0, 3, 1, 3, 2],
            [2, 3, 7, 2, 7, 6],
            [3, 0, 4, 3, 4, 7],
            [6, 5, 1, 6, 1, 2],
            [4, 5, 6, 4, 6, 7],
            [5, 4, 0, 5, 0, 1]];

        let points = [];

        // triangulerer med farger
        let sideColors = [];
        for (let j = 0; j < 6; ++j) {
            for (let i = 0; i < 6; ++i) {
                points.push(this._model.vertices[indices[j][i]]);

                // for solid colored faces use i = 0
                sideColors.push(this._model.colors[indices[j][i]]);

            }
        }

        this._gl.viewport(0, 0, canvas.width, canvas.height);
        this._gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this._gl.enable(this._gl.DEPTH_TEST);

        //
        //  Load shaders and initialize attribute buffers
        //
        this.program = initShaders(this._gl, "vshadercube.glsl", "fshadercube.glsl");

        let cBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, cBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, flatten(sideColors), this._gl.STATIC_DRAW);

        let aColor = this._gl.getAttribLocation(this.program, "aColor");
        this._gl.vertexAttribPointer(aColor, 4, this._gl.FLOAT, false, 0, 0);
        this._gl.enableVertexAttribArray(aColor);

        let vBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, flatten(points), this._gl.STATIC_DRAW);


        let vPosition = this._gl.getAttribLocation(this.program, "vPosition");
        this._gl.vertexAttribPointer(vPosition, 4, this._gl.FLOAT, false, 0, 0);
        this._gl.enableVertexAttribArray(vPosition);

        this.mvLoc = this._gl.getUniformLocation(this.program, "modelView");

        this.angleZ = 0;
        this.angleY = 0; 
        this.angleX = 0; 
        this.angleSmallY = 0;

        view = this;
        render();
    }

    /**
     * Update the cube.
     */
    update() {
        if (this.axis == X_AXIS) {
            this.angleX += 0.5;
        } else if (this.axis == Y_AXIS) {
            this.angleY += 0.5;
        } else if (this.axis == Z_AXIS) {
            this.angleZ += 0.5;
        }

        let rotX = rotateX(this.angleX);
        let rotZ = rotateZ(this.angleZ);
        let rotY = rotateY(this.angleY);  
        
        this.angleSmallY -= 3.0; 
        let smallRotY = rotateY(this.angleSmallY);
        let rotAll = mult(rotZ, mult(rotX, rotY));

        let mv1 = mult(this.scale1, rotAll);
        mv1 = mult(mv1, this.globalScale);
        mv1 = mult(mv1, this.trans1);

        let mv2 = mult(this.scale2, rotAll);
        mv2 = mult(mv2, this.globalScale);
        mv2 = mult(mv2, this.trans2);

        let mv3 = mult(this.scale3, rotAll);
        mv3 = mult(mv3, this.globalScale);
        mv3 = mult(mv3, this.trans3);
        mv3 = mult(mv3, smallRotY);        
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);
        // this.theta[this._axis] += 2.0;
        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv1));
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this.numVertices);

        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv2));
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this.numVertices);

        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv3));
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this.numVertices);  
    }

    set axis(axis) {
        this._axis = axis;
    }

    get axis() {
        return this._axis;
    }
}

/**
 * Rendering function. In this example is this rendering function needed as callback from GL.
 */
function render() {
    
    view.update();
    requestAnimationFrame(render);
}
