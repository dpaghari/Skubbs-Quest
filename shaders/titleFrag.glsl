uniform sampler2D baseTexture;
uniform float baseSpeed;
uniform sampler2D noiseTexture;
uniform float noiseScale;
uniform float alpha;
uniform float time;

varying vec2 vUv;
void main()
{
	// Make the underside of the text appear to "shimmer"
	// Shift the noise along the map above the texture
	// to give an illusion of shimmering water
	vec2 uvTimeShift = vUv + vec2( -0.7, 4.5 ) * time * baseSpeed;
	vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
	vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );
	vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift );
    
	baseColor.a = alpha;
	gl_FragColor = baseColor;
}