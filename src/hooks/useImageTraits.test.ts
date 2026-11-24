import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ImageTraits } from '../lib/imageTraits';
import { useImageTraits } from './useImageTraits';

const pending = new Map<
  string,
  { resolve: (traits: ImageTraits) => void; reject: (error: Error) => void }
>();

vi.mock('../lib/imageTraits', () => ({
  loadImageTraits: (src: string) =>
    new Promise<ImageTraits>((resolve, reject) => pending.set(src, { resolve, reject })),
}));

const portrait: ImageTraits = { isPortrait: true, color: '#ff0000' };
const landscape: ImageTraits = { isPortrait: false, color: '#00ff00' };

beforeEach(() => pending.clear());

describe('useImageTraits', () => {
  it('is undefined until the image is analyzed, then returns its traits', async () => {
    const { result } = renderHook(() => useImageTraits('a.jpg'));
    expect(result.current).toBeUndefined();
    await act(async () => pending.get('a.jpg')?.resolve(portrait));
    expect(result.current).toEqual(portrait);
  });

  it('never returns traits for a previous source', async () => {
    const { result, rerender } = renderHook(({ src }) => useImageTraits(src), {
      initialProps: { src: 'a.jpg' },
    });
    rerender({ src: 'b.jpg' });
    await act(async () => pending.get('a.jpg')?.resolve(portrait));
    expect(result.current).toBeUndefined();
    await act(async () => pending.get('b.jpg')?.resolve(landscape));
    expect(result.current).toEqual(landscape);
  });

  it('stays undefined when the image fails to load', async () => {
    const { result } = renderHook(() => useImageTraits('a.jpg'));
    await act(async () => pending.get('a.jpg')?.reject(new Error('missing')));
    expect(result.current).toBeUndefined();
  });
});
