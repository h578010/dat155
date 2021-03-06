#version 300 es

in vec4 vPosition;
in vec4 aColor;
out vec4 vColor;

uniform vec3 theta;
uniform mat4 modelView;

void main() {
    // Compute the sines and cosines of theta for each of
    // the three axes in one computation.
    vec3 angles = radians( theta );
    vec3 c = cos( angles );
    vec3 s = sin( angles );

    // Remeber: these matrices are column-major
    mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
		    0.0,  c.x,  s.x, 0.0,
		    0.0, -s.x,  c.x, 0.0,
		    0.0,  0.0,  0.0, 1.0 );

    mat4 ry = mat4( c.y, 0.0, -s.y, 0.0,
		    0.0, 1.0,  0.0, 0.0,
		    s.y, 0.0,  c.y, 0.0,
		    0.0, 0.0,  0.0, 1.0 );


    mat4 rz = mat4( c.z, -s.z, 0.0, 0.0,
		    s.z,  c.z, 0.0, 0.0,
		    0.0,  0.0, 1.0, 0.0,
		    0.0,  0.0, 0.0, 1.0 );

    vColor = aColor;
    gl_Position = rz * ry * rx * vPosition;
}