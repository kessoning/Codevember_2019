const vertexShader = `
    precision highp float;
    precision highp int;
    
    //	Classic Perlin 3D Noise 
    //	by Stefan Gustavson
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
    float cnoise(vec3 P){
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
    
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
    
        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;
    
        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);
    
        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
    }
    
    uniform mat4 modelViewMatrix; // optional
    uniform mat4 projectionMatrix; // optional
    
    uniform sampler2D soundTexture;
    uniform float time;
    uniform float sensitivity;
    uniform float radius;
    uniform vec2 uDistortionX;
    uniform vec2 uDistortionY;
    uniform float uTravelLength;
    
    attribute vec3 position; 
    attribute vec2 angle;
    attribute vec2 noise;
    attribute vec2 soundUV;
    
    float pointsize = 2.0;

    #define PI 3.14159265358979
    
    varying vec2 vUv;

    float nsin(float val) {
        return sin(val) * 0.5 + 0.5;
    }

    vec3 getDistortion(float progress) {
        progress = clamp(progress, 0., 1.);
        float xAmp = uDistortionX.r;
        float xFreq = uDistortionX.g;
        float yAmp = uDistortionY.r;
        float yFreq = uDistortionY.g;
        return vec3(
            xAmp * nsin(progress * PI * xFreq - PI / 2.),
            yAmp * nsin(progress * PI * yFreq - PI / 2.),
            0.
        );
    }
    
    void main()	{
    
        vec2 suv = vec2(soundUV.y, soundUV.x);
        
        float st = texture2D(soundTexture, suv).r;
        float offset = texture2D(soundTexture, suv).b;
    
        float r = radius - (st * sensitivity);
    
        float x = r * angle.x;
        float y = r * angle.y;
        float z = position.z;
        
        // float d = (position.z / 500.0);
        // d = clamp(d, 0.0, 1.0);
        // float dd = 1.0 - d;
        // float a = color.a * d;
        
        vec3 vPosition = vec3(x, y, z);

        float progress = abs(vPosition.z / uTravelLength);
        vPosition.xyz += getDistortion(progress);
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    
        float distance = length(gl_Position);
        float attenuation = 500.0 / distance;
        // float cls = pointsize * attenuation;
        float cls = clamp(pointsize * attenuation, 1.0, pointsize);
    
    
        gl_PointSize = cls;//1.0;//st * 10.0;//cls;
    
        // float att = clamp(attenuation/1000.0, 0.0, 1.0);
        // float fov = 1.0 - att;
        // float a_v = 1.0;//cls/pointsize;
    
        // float alp = color.a*alpha;
    
        // vec3 texCol = texture2D(soundTexture, suv).rgb;
    
        // vec4 c = vec4(texCol.r * a_v, texCol.g * a_v, texCol.b * a_v, texCol.r * a_v);
        // if (a_v < 0.01) c = vec4(color.rgb, 0.0);
        // vColor = vec4(c);
    
        vUv = suv;
    }
`;

const fragmentShader = `
precision highp float;
precision highp int;
   
uniform sampler2D soundTexture;

varying vec2 vUv;

void main()	{

    vec4 color = texture2D(soundTexture, vUv);
    gl_FragColor = vec4(color.xyy, color.x*0.1);  

}
`;

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

export {
    vertexShader,
    fragmentShader,
    post_vertex,
    post_fragment
};
