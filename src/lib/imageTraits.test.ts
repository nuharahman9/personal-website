import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contrastRatio, type Rgb } from './color';

const sizes: Record<string, { width: number; height: number }> = {
  'portrait.jpg': { width: 400, height: 700 },
  'landscape.jpg': { width: 700, height: 400 },
};

let decodeCalls = 0;
let failNextDecode = false;

class FakeImage {
  src = '';
  get naturalWidth() {
    return sizes[this.src]?.width ?? 0;
  }
  get naturalHeight() {
    return sizes[this.src]?.height ?? 0;
  }
  decode(): Promise<void> {
    decodeCalls += 1;
    if (failNextDecode) {
      failNextDecode = false;
      return Promise.reject(new Error('decode failed'));
    }
    return Promise.resolve();
  }
}

const solidPixels = ([r, g, b]: Rgb) =>
  Uint8ClampedArray.from(Array.from({ length: 64 * 64 }, () => [r, g, b, 255]).flat());

const stubCanvas = (data: Uint8ClampedArray | null) =>
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    () =>
      (data && {
        drawImage: () => {},
        getImageData: () => ({ data }),
      }) as unknown as CanvasRenderingContext2D,
  );

const freshModule = async () => {
  vi.resetModules();
  return import('./imageTraits');
};

const hexToRgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

beforeEach(() => {
  decodeCalls = 0;
  failNextDecode = false;
  vi.stubGlobal('Image', FakeImage);
});

describe('loadImageTraits', () => {
  it('reports orientation', async () => {
    stubCanvas(solidPixels([240, 200, 20]));
    const { loadImageTraits } = await freshModule();
    expect((await loadImageTraits('portrait.jpg')).isPortrait).toBe(true);
    expect((await loadImageTraits('landscape.jpg')).isPortrait).toBe(false);
  });

  it('samples the dominant color as hex', async () => {
    stubCanvas(solidPixels([240, 200, 20]));
    const { loadImageTraits } = await freshModule();
    expect((await loadImageTraits('landscape.jpg')).color).toBe('#f0c814');
  });

  it('lightens a sampled color that is too dark for ink text', async () => {
    stubCanvas(solidPixels([60, 30, 110]));
    const { loadImageTraits, MIN_INK_CONTRAST } = await freshModule();
    const { color } = await loadImageTraits('landscape.jpg');
    expect(color).toBeDefined();
    expect(contrastRatio(hexToRgb(color ?? ''), [5, 2, 3])).toBeGreaterThanOrEqual(
      MIN_INK_CONTRAST,
    );
  });

  it('has no color for a gray image or when canvas is unavailable', async () => {
    stubCanvas(solidPixels([128, 128, 128]));
    let { loadImageTraits } = await freshModule();
    expect((await loadImageTraits('landscape.jpg')).color).toBeUndefined();

    stubCanvas(null);
    ({ loadImageTraits } = await freshModule());
    expect((await loadImageTraits('landscape.jpg')).color).toBeUndefined();
  });

  it('analyzes each image once', async () => {
    stubCanvas(solidPixels([240, 200, 20]));
    const { loadImageTraits } = await freshModule();
    await Promise.all([loadImageTraits('portrait.jpg'), loadImageTraits('portrait.jpg')]);
    await loadImageTraits('portrait.jpg');
    expect(decodeCalls).toBe(1);
  });

  it('retries after a failed load instead of caching the failure', async () => {
    stubCanvas(solidPixels([240, 200, 20]));
    const { loadImageTraits } = await freshModule();
    failNextDecode = true;
    await expect(loadImageTraits('portrait.jpg')).rejects.toThrow('decode failed');
    expect((await loadImageTraits('portrait.jpg')).isPortrait).toBe(true);
    expect(decodeCalls).toBe(2);
  });
});
