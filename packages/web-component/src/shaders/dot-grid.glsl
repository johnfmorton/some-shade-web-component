precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_dotRadius;
uniform float u_gridSize;
uniform vec2 u_dotOffset;
uniform vec3 u_bgColor;

void main() {
  vec2 uv = v_texCoord * u_resolution;

  // Which grid cell this fragment belongs to
  vec2 cell = floor(uv / u_gridSize);

  // Cell origin in pixel space
  vec2 cellOrigin = cell * u_gridSize;

  // Dot center within the cell, shifted by u_dotOffset (0–1 range)
  vec2 dotCenter = cellOrigin + u_dotOffset * u_gridSize;

  // 4×4 multi-sample average color across the cell
  vec3 avg = vec3(0.0);
  for (int y = 0; y < 4; y++) {
    for (int x = 0; x < 4; x++) {
      vec2 sampleUV = (cellOrigin + (vec2(float(x), float(y)) + 0.5) * (u_gridSize / 4.0)) / u_resolution;
      avg += texture2D(u_image, sampleUV).rgb;
    }
  }
  avg /= 16.0;

  // Wrapped (toroidal) distance from fragment to dot center within the cell
  vec2 d = (uv - dotCenter) / u_gridSize;
  d = fract(d + 0.5) - 0.5;  // wrap to [-0.5, 0.5]
  float dist = length(d) * u_gridSize;

  // Anti-aliased dot
  float mask = smoothstep(u_dotRadius + 0.5, u_dotRadius - 0.5, dist);

  vec3 result = mix(u_bgColor, avg, mask);

  gl_FragColor = vec4(result, 1.0);
}
