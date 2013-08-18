varying vec3 vNormal;
uniform float uTime;
uniform float uBeatTime;
uniform float uBeat;

void main() {
    vec3 light = vec3(1.0, 1.0, 1.0);
    light = normalize(light);
    vec3 nvNormal = normalize(vNormal);
    float prod = max(0.0, dot(nvNormal, light));
    gl_FragColor = vec4(0.0, prod, 0.0, 1.0);
}