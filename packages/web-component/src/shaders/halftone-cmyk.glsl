precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_dotRadius;
uniform float u_gridSize;
uniform float u_angleC;
uniform float u_angleM;
uniform float u_angleY;
uniform float u_angleK;

float halftone(vec2 uv, float angle, float channelValue, float gridSize, float dotRadius) {
  float rad = radians(angle);
  float s = sin(rad);
  float c = cos(rad);
  mat2 rot = mat2(c, -s, s, c);

  vec2 rotUV = rot * uv;
  vec2 grid = fract(rotUV / gridSize) - 0.5;

  float dist = length(grid) * gridSize;
  float radius = dotRadius * sqrt(channelValue);

  return smoothstep(radius + 0.5, radius - 0.5, dist);
}

void main() {
  vec2 uv = v_texCoord * u_resolution;
  vec4 color = texture2D(u_image, v_texCoord);

  float r = color.r;
  float g = color.g;
  float b = color.b;

  // RGB to CMYK
  float k = 1.0 - max(max(r, g), b);
  float invK = 1.0 - k;
  float cy = invK > 0.001 ? (invK - r) / invK : 0.0;
  float ma = invK > 0.001 ? (invK - g) / invK : 0.0;
  float ye = invK > 0.001 ? (invK - b) / invK : 0.0;

  // Compute halftone dots for each channel
  float cDot = halftone(uv, u_angleC, cy, u_gridSize, u_dotRadius);
  float mDot = halftone(uv, u_angleM, ma, u_gridSize, u_dotRadius);
  float yDot = halftone(uv, u_angleY, ye, u_gridSize, u_dotRadius);
  float kDot = halftone(uv, u_angleK, k, u_gridSize, u_dotRadius);

  // Subtractive color mixing on white paper
  float outR = (1.0 - cDot) * (1.0 - kDot);
  float outG = (1.0 - mDot) * (1.0 - kDot);
  float outB = (1.0 - yDot) * (1.0 - kDot);

  gl_FragColor = vec4(outR, outG, outB, color.a);
}
