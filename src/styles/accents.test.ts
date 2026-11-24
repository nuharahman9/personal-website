import { describe, expect, it } from 'vitest';
import tokens from './tokens.css?raw';
import { ACCENTS } from './accents';
import { sections } from '../sections/registry';

describe('accents', () => {
  it('defines a CSS custom property for every accent', () => {
    for (const accent of ACCENTS) expect(tokens).toContain(`--accent-${accent}:`);
  });

  it('gives each section a distinct accent', () => {
    const used = sections.map((s) => s.accent);
    expect(new Set(used).size).toBe(used.length);
  });
});
