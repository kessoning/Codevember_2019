const psVertex = `
  precision highp float;

  attribute vec2 reference;

  uniform sampler2D texturePosition;
  uniform sampler2D textureVelocity;
  uniform sampler2D textureVideo;

  uniform vec2 screenResolution;
  
  varying vec3 colors;

  void main() {

    vec4 _tp = texture2D(texturePosition, reference);
    float _x = mod(_tp.x, screenResolution.x);
    float _y = mod(_tp.y, screenResolution.y);

    vec3 _col = texture2D(textureVideo, reference).xyz;
    colors = _col;

    vec4 _fp = vec4(_x, _y, 0.0, 1.0);

    gl_PointSize = 1.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * _fp;
  }
`;

const psFragment = `
  precision mediump float;

  uniform vec3 col;
  uniform float alpha;

  varying vec3 colors;

  void main() {
      gl_FragColor = vec4(colors.xyz, alpha);
  }
`;

export {
  psVertex,
  psFragment
};
