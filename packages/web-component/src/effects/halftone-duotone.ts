import type { EffectDefinition } from '../types.js';
import fragmentShader from '../shaders/halftone-duotone.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';

export const halftoneDuotoneEffect: EffectDefinition = {
  name: 'halftone-duotone',
  fragmentShader,
  vertexShader,
  uniforms: [
    { name: 'u_dotRadius', type: 'float', default: 4, attribute: 'dot-radius' },
    { name: 'u_gridSize', type: 'float', default: 8, attribute: 'grid-size' },
    { name: 'u_duotoneColor', type: 'vec3', default: [0.0, 0.6, 0.8], attribute: 'duotone-color' },
    { name: 'u_angle', type: 'float', default: 0, attribute: 'angle' },
  ],
};
