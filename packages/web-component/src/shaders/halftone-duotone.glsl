precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_dotRadius;
uniform float u_gridSize;
uniform vec3 u_duotoneColor;
uniform float u_angle;

void main() {
  vec2 uv = v_texCoord * u_resolution;
  vec4 color = texture2D(u_image, v_texCoord);

  // Convert to luminance
  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float darkness = 1.0 - luma;

  // Rotate grid
  float rad = radians(u_angle);
  float s = sin(rad);
  float c = cos(rad);
  vec2 rotUV = mat2(c, -s, s, c) * uv;

  vec2 grid = fract(rotUV / u_gridSize) - 0.5;
  float dist = length(grid) * u_gridSize;
  float radius = u_dotRadius * sqrt(darkness);
  float dot = smoothstep(radius + 0.5, radius - 0.5, dist);

  // Mix duotone color (paper) with black (dots)
  vec3 result = mix(u_duotoneColor, vec3(0.0), dot);

  gl_FragColor = vec4(result, color.a);
}
