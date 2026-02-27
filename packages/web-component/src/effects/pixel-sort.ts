import type { EffectDefinition } from '../types.js';
import fragmentShader from '../shaders/pixel-sort.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';

export const pixelSortEffect: EffectDefinition = {
  name: 'pixel-sort',
  fragmentShader,
  vertexShader,
  uniforms: [
    { name: 'u_threshold', type: 'float', default: 0.5, attribute: 'threshold' },
    { name: 'u_direction', type: 'float', default: 0, attribute: 'sort-direction' },
    { name: 'u_span', type: 'float', default: 64, attribute: 'sort-span' },
  ],
};
