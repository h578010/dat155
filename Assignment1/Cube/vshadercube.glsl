#version 300 es

in vec4 vPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 modelView;

void main() {
    vColor = aColor;
    gl_Position = modelView * vPosition;
}