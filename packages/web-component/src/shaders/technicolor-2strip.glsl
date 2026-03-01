precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_dotRadius;
uniform float u_gridSize;
uniform float u_angleWarm;
uniform float u_angleCool;
uniform float u_angleK;
uniform float u_showWarm;
uniform float u_showCool;
uniform float u_showK;
uniform vec3 u_warmColor;
uniform vec3 u_coolColor;
uniform float u_blendMode;
uniform float u_intensityK;

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

  // Two-strip film capture: red-orange and blue-green filter responses
  float warmSep = dot(color.rgb, vec3(0.7, 0.3, 0.0));
  float coolSep = dot(color.rgb, vec3(0.0, 0.5, 0.5));

  // Black channel: derived from overall darkness
  float k = 1.0 - max(warmSep, coolSep);
  k = clamp(k * u_intensityK, 0.0, 1.0);

  // Halftone dots for each channel
  float warmDot = halftone(uv, u_angleWarm, warmSep, u_gridSize, u_dotRadius) * u_showWarm;
  float coolDot = halftone(uv, u_angleCool, coolSep, u_gridSize, u_dotRadius) * u_showCool;
  float kDot = halftone(uv, u_angleK, k, u_gridSize, u_dotRadius) * u_showK;

  // Blend modes affect how warm and cool dots combine where they overlap.
  // All modes use white paper; individual dots look the same.
  // Only the overlap regions differ between modes.
  vec3 overlap;
  if (u_blendMode < 0.5) {
    // Subtractive: dye overlap absorbs more light (darker)
    overlap = u_warmColor + u_coolColor - vec3(1.0);
  } else if (u_blendMode < 1.5) {
    // Additive: light overlap adds up (brighter)
    overlap = u_warmColor + u_coolColor;
  } else {
    // Screen: soft additive overlap with natural clamping
    overlap = vec3(1.0) - (vec3(1.0) - u_warmColor) * (vec3(1.0) - u_coolColor);
  }

  // Decompose into four halftone regions
  float onlyWarm = warmDot * (1.0 - coolDot);
  float onlyCool = coolDot * (1.0 - warmDot);
  float both = warmDot * coolDot;
  float neither = (1.0 - warmDot) * (1.0 - coolDot);

  // Composite: white paper base, colored dots, blend-mode-dependent overlap
  vec3 result = neither * vec3(1.0)
              + onlyWarm * u_warmColor
              + onlyCool * u_coolColor
              + both * overlap;

  // K channel darkening with intensity control
  result *= (1.0 - kDot);

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), color.a);
}
