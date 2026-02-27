export function createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  return gl;
}
