import type { EffectDefinition } from '../types.js';
import fragmentShader from '../shaders/halftone-cmyk.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';

export const halftoneCmykEffect: EffectDefinition = {
  name: 'halftone-cmyk',
  fragmentShader,
  vertexShader,
  uniforms: [
    { name: 'u_dotRadius', type: 'float', default: 4, attribute: 'dot-radius' },
    { name: 'u_gridSize', type: 'float', default: 8, attribute: 'grid-size' },
    { name: 'u_angleC', type: 'float', default: 15, attribute: 'angle-c' },
    { name: 'u_angleM', type: 'float', default: 75, attribute: 'angle-m' },
    { name: 'u_angleY', type: 'float', default: 0, attribute: 'angle-y' },
    { name: 'u_angleK', type: 'float', default: 45, attribute: 'angle-k' },
  ],
};
