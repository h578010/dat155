"use strict";

function createSphere(numSubdivisions) {

var subdivisions = 3;
if(numSubdivisions) subdivisions = numSubdivisions;

var data = {};
var radius = 0.5;

var sphereVertexCoordinates = [];
var sphereVertexCoordinatesNormals = [];
var sphereVertexColors = [];
var sphereTextureCoordinates = [];
var sphereNormals = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function triangle(a, b, c) {

     sphereVertexCoordinates.push(a);
     sphereVertexCoordinates.push(b);
     sphereVertexCoordinates.push(c);

     // normals are vectors

     sphereNormals.push([a[0],a[1], a[2]]);
     sphereNormals.push([b[0],b[1], b[2]]);
     sphereNormals.push([c[0],c[1], c[2]]);

     sphereVertexColors.push([(1+a[0])/2.0, (1+a[1])/2.0, (1+a[2])/2.0, 1.0]);
     sphereVertexColors.push([(1+b[0])/2.0, (1+b[1])/2.0, (1+b[2])/2.0, 1.0]);
     sphereVertexColors.push([(1+c[0])/2.0, (1+c[1])/2.0, (1+c[2])/2.0, 1.0]);

     sphereTextureCoordinates.push([0.5*Math.acos(a[0])/Math.PI, 0.5*Math.asin(a[1]/Math.sqrt(1.0-a[0]*a[0]))/Math.PI]);
     sphereTextureCoordinates.push([0.5*Math.acos(b[0])/Math.PI, 0.5*Math.asin(b[1]/Math.sqrt(1.0-b[0]*b[0]))/Math.PI]);
     sphereTextureCoordinates.push([0.5*Math.acos(c[0])/Math.PI, 0.5*Math.asin(c[1]/Math.sqrt(1.0-c[0]*c[0]))/Math.PI]);

}

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

tetrahedron(va, vb, vc, vd, subdivisions);


function translate(x, y, z){
   for(var i=0; i<sphereVertexCoordinates.length; i++) {
     sphereVertexCoordinates[i][0] += x;
     sphereVertexCoordinates[i][1] += y;
     sphereVertexCoordinates[i][2] += z;
   };
}

function scale(sx, sy, sz){
    for(var i=0; i<sphereVertexCoordinates.length; i++) {
        sphereVertexCoordinates[i][0] *= sx;
        sphereVertexCoordinates[i][1] *= sy;
        sphereVertexCoordinates[i][2] *= sz;
    };
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function rotate( angle, axis) {

    var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

    var x = axis[0]/d;
    var y = axis[1]/d;
    var z = axis[2]/d;

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var mat = [
        [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
        [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
        [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
    ];

    for(var i=0; i<sphereVertexCoordinates.length; i++) {
          var u = [0, 0, 0];
          var v = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++) {
              u[j] += mat[j][k]*sphereVertexCoordinates[i][k];
              v[j] += mat[j][k]*sphereNormals[i][k];
            };
           for( var j =0; j<3; j++) {
             sphereVertexCoordinates[i][j] = u[j];
             sphereNormals[i][j] = v[j];
           };
    };
}

data.TriangleVertices = sphereVertexCoordinates;
data.TriangleNormals = sphereNormals;
data.TriangleVertexColors = sphereVertexColors;
data.TextureCoordinates = sphereTextureCoordinates;
data.rotate = rotate;
data.translate = translate;
data.scale = scale;
return data;
}


function goldMaterial() {
    let data  = {};
    data.materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    data.materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
    data.materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    data.materialShininess = 100.0;
    return data;
}

function light0() {
    let data = {};
    data.lightPosition = vec4(0.0, -12.0, 0.0, 0.0 );;
    data.lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    data.lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    data.lightSpecular = vec4(1.0, 1.0, 1.0, 1.0 );
    data.lightShineness = 10;
    return data;
}

class Sphere {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        var mySphere = createSphere();
        this.material = goldMaterial();
        this.light = light0();
        this.normals = mySphere.TriangleNormals;
        this.points = mySphere.TriangleVertices;
    }

    init() { 
    // Attributes: aPostition, aColor, aNormal, 
    // Uniforms: theta, modelViewMatrix, projectionMatrix, lightPosition, shininess
    // Uniforms: ambientProduct, diffuseProduct, specularProduct
        let gl = this.gl;
        gl.useProgram(this.program);

        this.positionLoc = gl.getAttribLocation(this.program, "aPosition");
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

        this.normalLoc = gl.getAttribLocation(this.program, "aNormal");
        this.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW );

        this.ambientProductLoc = gl.getUniformLocation(this.program, "ambientProduct");
        this.diffuseProductLoc = gl.getUniformLocation(this.program, "diffuseProduct");
        this.specularProductLoc = gl.getUniformLocation(this.program, "specularProduct");
        this.modelViewMatrixLoc = gl.getUniformLocation(this.program, "modelViewMatrix");
        this.lightPositionLoc = gl.getUniformLocation(this.program, "lightPosition");
        projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "projectionMatrix"), false, flatten(projectionMatrix));
    }

    draw(mvMatrix) {
        let gl = this.gl;
        gl.useProgram(this.program);

        gl.enableVertexAttribArray(this.positionLoc2);
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
        gl.vertexAttribPointer(this.positionLoc2, 4, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.normalLoc);
        gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4fv(this.ambientProductLoc, flatten(this.material.materialAmbient));
        gl.uniform4fv(this.diffuseProductLoc, flatten(this.material.materialDiffuse));
        gl.uniform4fv(this.specularProductLoc, flatten(this.material.materialSpecular));
        gl.uniform4fv(this.lightPositionLoc, flatten(this.light.lightPosition));

        gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, flatten(mvMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
    }
}

