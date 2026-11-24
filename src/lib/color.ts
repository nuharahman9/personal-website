export type Rgb = readonly [number, number, number];

const HUE_BIN_DEGREES = 15;
const HUE_BIN_COUNT = 360 / HUE_BIN_DEGREES;
const MIN_CHROMA = 0.08;
const LIGHTNESS_STEP = 0.005;

interface HueBin {
  weight: number;
  r: number;
  g: number;
  b: number;
}

function hueDegrees(r: number, g: number, b: number, max: number, chroma: number): number {
  const sector =
    max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
  return (sector * 60 + 360) % 360;
}

export function dominantColor(pixels: Uint8ClampedArray): Rgb | undefined {
  const bins: HueBin[] = Array.from({ length: HUE_BIN_COUNT }, () => ({
    weight: 0,
    r: 0,
    g: 0,
    b: 0,
  }));

  for (let i = 0; i + 2 < pixels.length; i += 4) {
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const max = Math.max(r, g, b) / 255;
    const chroma = max - Math.min(r, g, b) / 255;
    if (chroma < MIN_CHROMA) continue;

    const hue = hueDegrees(r / 255, g / 255, b / 255, max, chroma);
    const bin = bins[Math.floor(hue / HUE_BIN_DEGREES) % HUE_BIN_COUNT];
    if (!bin) continue;
    const weight = chroma * chroma;
    bin.weight += weight;
    bin.r += r * weight;
    bin.g += g * weight;
    bin.b += b * weight;
  }

  const top = bins.reduce((best, bin) => (bin.weight > best.weight ? bin : best));
  if (top.weight === 0) return undefined;
  return [top.r / top.weight, top.g / top.weight, top.b / top.weight];
}

function relativeLuminance([r, g, b]: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const v = channel / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness];
  const chroma = max - min;
  const saturation = lightness > 0.5 ? chroma / (2 - max - min) : chroma / (max + min);
  return [hueDegrees(R, G, B, max, chroma), saturation, lightness];
}

function hslToRgb(hue: number, saturation: number, lightness: number): Rgb {
  const a = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12;
    return (lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return [channel(0), channel(8), channel(4)];
}

export function withContrastAgainst(color: Rgb, ink: Rgb, minRatio: number): Rgb {
  if (contrastRatio(color, ink) >= minRatio) return color;
  const [hue, saturation, startLightness] = rgbToHsl(color);
  for (let lightness = startLightness; lightness < 1; lightness += LIGHTNESS_STEP) {
    const candidate = hslToRgb(hue, saturation, lightness);
    if (contrastRatio(candidate, ink) >= minRatio) return candidate;
  }
  return [255, 255, 255];
}

export const toHex = (color: Rgb): string =>
  `#${color
    .map((channel) =>
      Math.round(Math.min(255, Math.max(0, channel)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
