const post_vertex = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
    
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
    
    }
`;

const post_fragment = `
    // Blur effect
    // Edited from https://www.shadertoy.com/view/XdfGDH

    precision highp float;
    precision highp int;

    uniform vec2 iResolution;
    uniform sampler2D tDiffuse;
    uniform float iGlobalTime;

    varying vec2 vUv;

    float AMPLITUDE = 0.0;

    float normpdf( in float x, in float sigma) {
        return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
    }

    void main() {
        vec2 uv = vUv;
        vec3 c = texture2D(tDiffuse, gl_FragCoord.xy / iResolution.xy).rgb;

        const int mSize = 7;
        const int kSize = (mSize - 1) / 2;
        float kernel[mSize];
        vec3 final_colour = vec3(0.0);

        //create the 1-D kernel
        float sigma = 7.0;
        float Z = 0.0;
        for (int j = 0; j <= kSize; ++j) {
            kernel[kSize + j] = kernel[kSize - j] = normpdf(float(j), sigma);
        }

        //get the normalization factor (as the gaussian has been clamped)
        for (int j = 0; j < mSize; ++j) {
            Z += kernel[j];
        }

        //read out the texels
        for (int i = -kSize; i <= kSize; ++i) {
            for (int j = -kSize; j <= kSize; ++j) {
                final_colour += kernel[kSize + j] * kernel[kSize + i] * texture2D(tDiffuse, (gl_FragCoord.xy + vec2(float(i), float(j))) / iResolution.xy).rgb;
            }
        }

        vec3 c_step_1 = final_colour / (Z * Z);

        gl_FragColor = vec4(c_step_1, 1.0);
    }
`;

export { post_vertex, post_fragment };