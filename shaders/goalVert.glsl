// Goal shader used to create a bumpy texture on the
// goal gem. Uses perlin noise to create the effect.

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalMatrix * vec3(normal);
    vPosition = position;
    gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}