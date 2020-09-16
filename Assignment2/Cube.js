let NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)
let points = [];
let colors = [];

let vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
let vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}

function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

class Cube {
  constructor(gl, program) {
    this.gl = gl;
    this.program = program;
    colorCube();
  }

  init() {
    let gl = this.gl;
    gl.useProgram(this.program);
    this.vBuffer = gl.createBuffer();
    
    this.positionLoc = gl.getAttribLocation(this.program, "aPosition");
    this.cBuffer = gl.createBuffer();
    this.colorLoc = gl.getAttribLocation(this.program, "aColor");

    this.modelViewMatrixLoc = gl.getUniformLocation(this.program, "modelViewMatrix");
    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "projectionMatrix"), false, flatten(projectionMatrix));
  }

  draw(mvMatrix) {
    let gl = this.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.colorLoc);

    gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  }
}