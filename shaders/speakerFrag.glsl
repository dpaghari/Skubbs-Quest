uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

/* Turbulence from explosion demo at:
 www.clicktorelease.com/code/perlin/explosion.html
 */
float turbulence(vec3 p) {
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++){
        float power = pow(2.0, f);
        t += abs(pnoise(vec3(power * p ), vec3(10.0, 10.0, 10.0)) / power);
    }
    return t;
}

void main() {
    vec3 nvNormal = normalize(vNormal);
    vec3 lookup = vPosition * 0.005 + 0.1 * uTime * vec3(0.0, 0.0, 1.0);
    float turb = turbulence(lookup) * 10.0 + 2.5;
    gl_FragColor = vec4(turb, 0.0, 0.0, 1.0);
}