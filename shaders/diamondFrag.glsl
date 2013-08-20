// Toon shade the diamond gem

varying vec3 vNormal;

vec4 transform(float u) {
    // Give different shades to 
	// sections of the model 
    if (u > 0.95)
        return vec4(1.0,1.0,0.5,1.0);
    else if (u > 0.5)
        return vec4(0.8,0.8,0.3,1.0);
    else if (u > 0.25)
        return vec4(0.4,0.4,0.2,1.0);
    else
        return vec4(0.2,0.2,0.1,1.0);
}
void main() {
    vec3 light = vec3(0.7, 0.7, 1.0);
    // normalize light vector
    light = normalize(light);
    float prod = max(0.0, dot(normalize(vNormal), light));
    gl_FragColor = transform(prod);
}