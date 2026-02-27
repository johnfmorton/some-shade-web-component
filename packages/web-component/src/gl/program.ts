export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }

  return shader;
}

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: Map<string, number>;
  uniformLocations: Map<string, WebGLUniformLocation>;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexSrc: string,
  fragmentSrc: string,
): ProgramInfo {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }

  // Clean up individual shaders — they're linked into the program now
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  // Cache attribute locations
  const attribLocations = new Map<string, number>();
  const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
  for (let i = 0; i < attribCount; i++) {
    const info = gl.getActiveAttrib(program, i);
    if (info) {
      attribLocations.set(info.name, gl.getAttribLocation(program, info.name));
    }
  }

  // Cache uniform locations
  const uniformLocations = new Map<string, WebGLUniformLocation>();
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < uniformCount; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) {
      const loc = gl.getUniformLocation(program, info.name);
      if (loc) uniformLocations.set(info.name, loc);
    }
  }

  return { program, attribLocations, uniformLocations };
}

export function setUniforms(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  uniforms: Record<string, number | number[]>,
): void {
  for (const [name, value] of Object.entries(uniforms)) {
    const loc = programInfo.uniformLocations.get(name);
    if (!loc) continue;

    if (typeof value === 'number') {
      gl.uniform1f(loc, value);
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 2:
          gl.uniform2fv(loc, value);
          break;
        case 3:
          gl.uniform3fv(loc, value);
          break;
        case 4:
          gl.uniform4fv(loc, value);
          break;
      }
    }
  }
}
