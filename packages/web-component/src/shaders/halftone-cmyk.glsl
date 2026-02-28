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
uniform float u_showC;
uniform float u_showM;
uniform float u_showY;
uniform float u_showK;
uniform float u_intensityK;

// Returns the texture-space UV of the cell center for a given rotation angle
vec2 cellCenterUV(vec2 uv, float angle) {
  float rad = radians(angle);
  float s = sin(rad);
  float c = cos(rad);
  mat2 rot = mat2(c, -s, s, c);
  mat2 invRot = mat2(c, s, -s, c);

  vec2 rotUV = rot * uv;
  vec2 cell = floor(rotUV / u_gridSize);
  vec2 cellCenter = (cell + 0.5) * u_gridSize;

  return (invRot * cellCenter) / u_resolution;
}

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

  // Sample at each channel's cell center (each channel has a different grid rotation)
  vec3 cRgb = texture2D(u_image, cellCenterUV(uv, u_angleC)).rgb;
  vec3 mRgb = texture2D(u_image, cellCenterUV(uv, u_angleM)).rgb;
  vec3 yRgb = texture2D(u_image, cellCenterUV(uv, u_angleY)).rgb;
  vec3 kRgb = texture2D(u_image, cellCenterUV(uv, u_angleK)).rgb;

  // RGB to CMYK for each channel's sample
  float cK = 1.0 - max(max(cRgb.r, cRgb.g), cRgb.b);
  float cInvK = 1.0 - cK;
  float cy = cInvK > 0.001 ? (cInvK - cRgb.r) / cInvK : 0.0;

  float mK = 1.0 - max(max(mRgb.r, mRgb.g), mRgb.b);
  float mInvK = 1.0 - mK;
  float ma = mInvK > 0.001 ? (mInvK - mRgb.g) / mInvK : 0.0;

  float yK = 1.0 - max(max(yRgb.r, yRgb.g), yRgb.b);
  float yInvK = 1.0 - yK;
  float ye = yInvK > 0.001 ? (yInvK - yRgb.b) / yInvK : 0.0;

  float k = 1.0 - max(max(kRgb.r, kRgb.g), kRgb.b);
  k = clamp(k * u_intensityK, 0.0, 1.0);

  // Compute halftone dots for each channel
  float cDot = halftone(uv, u_angleC, cy, u_gridSize, u_dotRadius) * u_showC;
  float mDot = halftone(uv, u_angleM, ma, u_gridSize, u_dotRadius) * u_showM;
  float yDot = halftone(uv, u_angleY, ye, u_gridSize, u_dotRadius) * u_showY;
  float kDot = halftone(uv, u_angleK, k, u_gridSize, u_dotRadius) * u_showK;

  // Subtractive color mixing on white paper
  float outR = (1.0 - cDot) * (1.0 - kDot);
  float outG = (1.0 - mDot) * (1.0 - kDot);
  float outB = (1.0 - yDot) * (1.0 - kDot);

  gl_FragColor = vec4(outR, outG, outB, texture2D(u_image, v_texCoord).a);
}
