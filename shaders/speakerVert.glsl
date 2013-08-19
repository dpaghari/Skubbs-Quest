varying vec3 vNormal;
uniform float uTime;
uniform float uBeatTime;
uniform float uBeat;

void main() {
    vNormal = normalMatrix * vec3(normal);
    gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4((0.8 + 0.2 * uBeat) * position, 1.0);
}