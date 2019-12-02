/* Fragment Shader Velocity
 * 
 * For the GPUComputation
 * Keeps track of the speed and velocity (direction) of the particles
 *
 */

 const fragmentShaderVelocity = `
    precision highp float;

    uniform float time;

    uniform sampler2D FlowField;
    uniform sampler2D ForceTexture;

    uniform vec2 screenResolution;

    #define PI 3.14159265358
    #define TWO_PI 6.28318530718

    void main() {

        vec2 _uv = gl_FragCoord.xy / resolution.xy;

        vec2 _pp = texture2D(texturePosition, _uv).xy;

        vec2 _ff_uv = _pp / screenResolution;

        vec3 _ff = texture2D(FlowField, _ff_uv).xyz;

        vec2 _f = texture2D(ForceTexture, _uv).xy;

        vec2 _v = texture2D(textureVelocity, _uv).xy;

        vec2 _a = vec2(0.0, 0.0);

        vec2 _d = vec2(_ff.x, _ff.y);
        _d *= _f.x;

        vec2 _s = _d - _v;
        float steerMagnitude = length(_s);
        _s *= (1.0 / steerMagnitude);
        _s *= _f.y;

        _a += _s;

        _v += _a;
        float _vm = length(_v);
        _v *= (1.0 / _vm);
        _v *= _f.x;

        gl_FragColor = vec4(_v.xy, 0.0, 1.0);

    }
`;

export {
    fragmentShaderVelocity
};
