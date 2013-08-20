varying vec3 vNormal;
varying vec2 vUV;
uniform sampler2D tBumpTexture;
uniform sampler2D tLightingTexture;

void main() {
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    vec4 bumpColor = texture2D(tBumpTexture, vUV);
    vec3 norm = normalize(vNormal + 0.8 * bumpColor.rgb);
    
    vec2 tpos = vec2(0.5 + norm.x * 0.49, 0.5 + norm.y * 0.49);
    vec4 tColor = texture2D(tLightingTexture, tpos);
    gl_FragColor = vec4(tColor.rgb, 1.0);
}