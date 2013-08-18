varying vec3 vNormal;
uniform float uTime;
varying vec3 vPosition;

void main() {
    vec3 nvNormal = normalize(vNormal);
    gl_FragColor = vec4(cnoise(vPosition * 0.03 + uTime * vec3(1.0, 0.0, 0.0)), 0.0, 0.0, 1.0);
}