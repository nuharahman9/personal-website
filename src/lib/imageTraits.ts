import { dominantColor, toHex, withContrastAgainst, type Rgb } from './color';

export interface ImageTraits {
  isPortrait: boolean;
  color: string | undefined;
}

const SAMPLE_SIZE = 64;
const INK: Rgb = [5, 2, 3];
export const MIN_INK_CONTRAST = 5.5;

const cache = new Map<string, Promise<ImageTraits>>();

function sampleColor(image: HTMLImageElement): string | undefined {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return undefined;
  context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const dominant = dominantColor(context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data);
  return dominant && toHex(withContrastAgainst(dominant, INK, MIN_INK_CONTRAST));
}

async function analyze(src: string): Promise<ImageTraits> {
  const image = new Image();
  image.src = src;
  await image.decode();
  return {
    isPortrait: image.naturalHeight > image.naturalWidth,
    color: sampleColor(image),
  };
}

export function loadImageTraits(src: string): Promise<ImageTraits> {
  const cached = cache.get(src);
  if (cached) return cached;
  const pending = analyze(src);
  cache.set(src, pending);
  pending.catch(() => cache.delete(src));
  return pending;
}
