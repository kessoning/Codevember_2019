/* Fragment Shader Position
 * 
 * For the GPUComputation
 * 
 */

const fragmentShaderPosition = `
  precision highp float;
  uniform vec2 screenResolution;
  void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 _tp = texture2D(texturePosition, uv);
      vec3 _p = _tp.xyz;
      vec3 _v = texture2D(textureVelocity, uv).xyz;
      vec3 _np = _p + _v;
      _np.x = mod(_np.x, screenResolution.x);
      _np.y = mod(_np.y, screenResolution.y);
      gl_FragColor = vec4(_np, 1.0);
  }
`;

export {
  fragmentShaderPosition
};