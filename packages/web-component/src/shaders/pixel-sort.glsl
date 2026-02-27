precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_threshold;
uniform float u_direction;
uniform float u_span;

float brightness(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = v_texCoord;
  vec4 color = texture2D(u_image, uv);
  float bri = brightness(color.rgb);

  // Boundary pixel — pass through
  if (bri < u_threshold) {
    gl_FragColor = color;
    return;
  }

  float rad = radians(u_direction);
  vec2 dir = vec2(cos(rad), sin(rad));
  vec2 step = dir / u_resolution;

  int spanLen = int(u_span);

  // Walk backward to find span start
  int backCount = 0;
  for (int i = 1; i < 256; i++) {
    if (i >= spanLen) break;
    vec2 sampleUV = uv - step * float(i);
    if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) break;
    float b = brightness(texture2D(u_image, sampleUV).rgb);
    if (b < u_threshold) break;
    backCount++;
  }

  // Walk forward to find span end
  int fwdCount = 0;
  for (int i = 1; i < 256; i++) {
    if (i >= spanLen) break;
    vec2 sampleUV = uv + step * float(i);
    if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) break;
    float b = brightness(texture2D(u_image, sampleUV).rgb);
    if (b < u_threshold) break;
    fwdCount++;
  }

  int totalSpan = backCount + 1 + fwdCount;
  vec2 spanStartUV = uv - step * float(backCount);

  // Count pixels in span that are darker than current (= rank)
  int rank = 0;
  for (int i = 0; i < 256; i++) {
    if (i >= totalSpan) break;
    vec2 sampleUV = spanStartUV + step * float(i);
    float b = brightness(texture2D(u_image, sampleUV).rgb);
    if (b < bri) rank++;
  }

  // Resample at sorted position
  vec2 sortedUV = spanStartUV + step * float(rank);
  gl_FragColor = texture2D(u_image, sortedUV);
}
