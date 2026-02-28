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

  // Halftone dots for each channel
  float warmDot = halftone(uv, u_angleWarm, warmSep, u_gridSize, u_dotRadius) * u_showWarm;
  float coolDot = halftone(uv, u_angleCool, coolSep, u_gridSize, u_dotRadius) * u_showCool;
  float kDot = halftone(uv, u_angleK, k, u_gridSize, u_dotRadius) * u_showK;

  // Subtractive mixing: start with white paper, subtract dye layers
  vec3 paper = vec3(1.0);
  paper -= warmDot * (vec3(1.0) - u_warmColor);
  paper -= coolDot * (vec3(1.0) - u_coolColor);
  paper *= (1.0 - kDot);

  gl_FragColor = vec4(clamp(paper, 0.0, 1.0), color.a);
}
