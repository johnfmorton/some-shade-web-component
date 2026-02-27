import type { EffectDefinition } from './types.js';
import { halftoneCmykEffect } from './effects/halftone-cmyk.js';
import { halftoneDuotoneEffect } from './effects/halftone-duotone.js';
import { dotGridEffect } from './effects/dot-grid.js';

const effects = new Map<string, EffectDefinition>();

export function register(effect: EffectDefinition): void {
  effects.set(effect.name, effect);
}

export function get(name: string): EffectDefinition | undefined {
  return effects.get(name);
}

export function list(): string[] {
  return Array.from(effects.keys());
}

// Pre-register built-in effects
register(halftoneCmykEffect);
register(halftoneDuotoneEffect);
register(dotGridEffect);
