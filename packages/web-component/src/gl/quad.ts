import type { ProgramInfo } from './program.js';

export function createQuad(gl: WebGLRenderingContext, programInfo: ProgramInfo): WebGLBuffer {
  // Fullscreen quad: positions + texcoords interleaved
  // Position: clip space (-1 to 1), TexCoord: (0 to 1, flipped Y for image)
  const vertices = new Float32Array([
    // pos.x  pos.y  tex.s  tex.t
    -1, -1,    0,     1,
     1, -1,    1,     1,
    -1,  1,    0,     0,
     1,  1,    1,     0,
  ]);

  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Failed to create buffer');

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const stride = 4 * Float32Array.BYTES_PER_ELEMENT;

  const posLoc = programInfo.attribLocations.get('a_position');
  if (posLoc !== undefined && posLoc !== -1) {
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
  }

  const texLoc = programInfo.attribLocations.get('a_texCoord');
  if (texLoc !== undefined && texLoc !== -1) {
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  }

  return buffer;
}

export function drawQuad(gl: WebGLRenderingContext): void {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
