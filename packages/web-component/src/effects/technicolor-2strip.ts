import type { EffectDefinition } from '../types.js';
import fragmentShader from '../shaders/technicolor-2strip.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';

export const technicolor2StripEffect: EffectDefinition = {
  name: 'technicolor-2strip',
  fragmentShader,
  vertexShader,
  uniforms: [
    { name: 'u_dotRadius', type: 'float', default: 7, attribute: 'dot-radius' },
    { name: 'u_gridSize', type: 'float', default: 10, attribute: 'grid-size' },
    { name: 'u_angleWarm', type: 'float', default: 15, attribute: 'angle-warm' },
    { name: 'u_angleCool', type: 'float', default: 75, attribute: 'angle-cool' },
    { name: 'u_angleK', type: 'float', default: 45, attribute: 'angle-k' },
    { name: 'u_showWarm', type: 'float', default: 1, attribute: 'show-warm' },
    { name: 'u_showCool', type: 'float', default: 1, attribute: 'show-cool' },
    { name: 'u_showK', type: 'float', default: 1, attribute: 'show-k' },
    { name: 'u_warmColor', type: 'vec3', default: [0.85, 0.25, 0.06], attribute: 'warm-color' },
    { name: 'u_coolColor', type: 'vec3', default: [0.05, 0.65, 0.60], attribute: 'cool-color' },
    { name: 'u_blendMode', type: 'float', default: 1, attribute: 'blend-mode' },
    { name: 'u_intensityK', type: 'float', default: 1, attribute: 'intensity-k' },
  ],
};
