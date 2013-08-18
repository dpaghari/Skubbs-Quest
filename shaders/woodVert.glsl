varying vec3 vNormal;
varying vec3 vPosition;
            
void main() {
    // Surface normal (view space)
    vNormal = normalMatrix * vec3(normal);
    // Position (model space)
    vPosition = position;
    gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}