import { describe, expect, it } from 'vitest';
import { contrastRatio, dominantColor, toHex, withContrastAgainst, type Rgb } from './color';

const INK: Rgb = [5, 2, 3];

const pixels = (...runs: readonly [Rgb, number][]): Uint8ClampedArray =>
  Uint8ClampedArray.from(
    runs.flatMap(([[r, g, b], count]) =>
      Array.from({ length: count }, () => [r, g, b, 255]).flat(),
    ),
  );

describe('dominantColor', () => {
  it('returns the color of a uniform saturated image', () => {
    expect(toHex(dominantColor(pixels([[200, 40, 40], 10])) ?? [0, 0, 0])).toBe('#c82828');
  });

  it('ignores grays so a small colored area still wins', () => {
    const color = dominantColor(pixels([[128, 128, 128], 90], [[30, 200, 60], 10]));
    expect(color && toHex(color)).toBe('#1ec83c');
  });

  it('picks the hue that covers more of the image', () => {
    const color = dominantColor(pixels([[40, 80, 220], 70], [[220, 200, 20], 30]));
    expect(color && toHex(color)).toBe('#2850dc');
  });

  it('returns undefined when the image has no color', () => {
    expect(
      dominantColor(pixels([[0, 0, 0], 5], [[255, 255, 255], 5], [[120, 120, 120], 5])),
    ).toBeUndefined();
  });
});

describe('withContrastAgainst', () => {
  it('leaves colors that already pass untouched', () => {
    const yellow: Rgb = [251, 227, 12];
    expect(withContrastAgainst(yellow, INK, 5.5)).toBe(yellow);
  });

  it('lightens a dark color until it passes, keeping its hue family', () => {
    const darkPurple: Rgb = [107, 83, 152];
    const lifted = withContrastAgainst(darkPurple, INK, 5.5);
    expect(contrastRatio(lifted, INK)).toBeGreaterThanOrEqual(5.5);
    const [r, g, b] = lifted;
    expect(b).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(g);
  });

  it('still reaches the target from pure black', () => {
    expect(contrastRatio(withContrastAgainst([0, 0, 0], INK, 5.5), INK)).toBeGreaterThanOrEqual(
      5.5,
    );
  });
});

describe('toHex', () => {
  it('rounds and clamps channels', () => {
    expect(toHex([255.4, -3, 15.6])).toBe('#ff0010');
  });
});
