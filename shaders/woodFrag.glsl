// Procedural wood texture used to create the board.
// Uses perlin noise to create the effect.

varying vec3 vNormal;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vView;

float wood(vec3 p) {
    float noise = 4.0 * cnoise(p * vec3(0.1, 0.005, 0.02));
    return sin(0.3 * length(p.xz) + noise);
}

void main() {
    float noise = wood(vPosition);
    vec4 woodDark = vec4((150.0 / 255.0), (111.0 / 255.0), 51.0/255.0, 1.0);
    vec4 woodLight = vec4(249.0 / 255.0, 195.0 / 255.0, 150.0/255.0, 1.0);
    vec4 noiseColor = noise * woodDark + (1.0 - noise) * woodLight;
    gl_FragColor = vec4(noiseColor.rgb, 1.0);
}