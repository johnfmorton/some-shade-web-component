import type { EffectDefinition } from '../types.js';
import fragmentShader from '../shaders/dot-grid.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';

export const dotGridEffect: EffectDefinition = {
  name: 'dot-grid',
  fragmentShader,
  vertexShader,
  uniforms: [
    { name: 'u_dotRadius', type: 'float', default: 4, attribute: 'dot-radius' },
    { name: 'u_gridSize', type: 'float', default: 8, attribute: 'grid-size' },
    { name: 'u_dotOffset', type: 'vec2', default: [0.5, 0.5], attribute: 'dot-offset' },
    { name: 'u_bgColor', type: 'vec3', default: [1.0, 1.0, 1.0], attribute: 'bg-color' },
  ],
};
