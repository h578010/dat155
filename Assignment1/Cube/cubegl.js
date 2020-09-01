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
        this._axis = X_AXIS;

        let canvas = document.getElementById("gl-canvas");

        this.theta = [0, 0, 0];
        this.numVertices = 36;
        
        gl = canvas.getContext('webgl2');
        this._gl = gl;
        if (!gl) {
            alert("WebGL 2.0 isn't available");
        }
        this.mv = mat4(
            1, 0, 0, 0,
            0, 1, 0, -0.45,
            0, 0, 1, 0,
            0, 0, 0, 1);
        
        this.mv2 = mat4(
            0.5, 0, 0, 0,
            0, 0.5, 0, 0.30,
            0, 0, 0.5, 0,
            0, 0, 0, 1);

        this.mv3 = mat4(
            0.25, 0, 0, 0,
            0, 0.25, 0, 0.67,
            0, 0, 0.25, 0,
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


        view = this;
        render();
    }

    /**
     * Update the cube.
     */
    update() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);
        // this.theta[this._axis] += 2.0;
        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv));
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this.numVertices);

        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv2));
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this.numVertices);

        this._gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv3));
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
