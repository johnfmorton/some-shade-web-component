export interface UniformDefinition {
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4';
  default: number | number[];
  attribute?: string;
}

export interface EffectDefinition {
  name: string;
  fragmentShader: string;
  vertexShader: string;
  uniforms: UniformDefinition[];
}
