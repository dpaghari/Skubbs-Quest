varying vec3 vNormal;

void main() {
    // Calculate normal in view space
    vNormal = normalMatrix * vec3(normal);
    gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
