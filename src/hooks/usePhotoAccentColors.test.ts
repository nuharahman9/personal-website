import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ImageTraits } from '../lib/imageTraits';
import { ACCENTS, type Accent } from '../styles/accents';
import { usePhotoAccentColors } from './usePhotoAccentColors';

const traitsBySrc: Record<string, ImageTraits | Error> = {
  'orange.jpg': { isPortrait: true, color: '#d66a28' },
  'green.jpg': { isPortrait: true, color: undefined },
  'blue.jpg': new Error('missing'),
  'yellow.jpg': { isPortrait: false, color: '#fbe30c' },
  'purple.jpg': { isPortrait: true, color: '#8f7ab6' },
  'pink.jpg': { isPortrait: true, color: '#dc5788' },
};

vi.mock('../lib/imageTraits', () => ({
  loadImageTraits: (src: string) => {
    const traits = traitsBySrc[src];
    return traits instanceof Error || !traits ? Promise.reject(traits) : Promise.resolve(traits);
  },
}));

const images: Record<Accent, string> = {
  orange: 'orange.jpg',
  green: 'green.jpg',
  blue: 'blue.jpg',
  yellow: 'yellow.jpg',
  violet: 'purple.jpg',
  pink: 'pink.jpg',
};

const rootValue = (accent: Accent) =>
  document.documentElement.style.getPropertyValue(`--accent-${accent}`);

afterEach(() => {
  for (const accent of ACCENTS) document.documentElement.style.removeProperty(`--accent-${accent}`);
});

describe('usePhotoAccentColors', () => {
  it('sets each accent to the color sampled from its photo', async () => {
    renderHook(() => usePhotoAccentColors(images));
    await act(async () => {});
    expect(rootValue('orange')).toBe('#d66a28');
    expect(rootValue('yellow')).toBe('#fbe30c');
    expect(rootValue('violet')).toBe('#8f7ab6');
    expect(rootValue('pink')).toBe('#dc5788');
  });

  it('keeps the stylesheet fallback when a photo has no color or fails to load', async () => {
    renderHook(() => usePhotoAccentColors(images));
    await act(async () => {});
    expect(rootValue('green')).toBe('');
    expect(rootValue('blue')).toBe('');
  });

  it('removes its overrides on unmount and ignores results that arrive after', async () => {
    const { unmount } = renderHook(() => usePhotoAccentColors(images));
    unmount();
    await act(async () => {});
    for (const accent of ACCENTS) expect(rootValue(accent)).toBe('');
  });
});
