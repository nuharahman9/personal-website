import type { CSSProperties } from 'react';
import blue from '../assets/blue.jpg';
import green from '../assets/green.jpg';
import orange from '../assets/orange.jpg';
import pink from '../assets/pink.jpg';
import violet from '../assets/purple.jpg';
import yellow from '../assets/yellow.jpg';

/** Accent names; each maps to a `--accent-<name>` custom property in tokens.css. */
export const ACCENTS = ['orange', 'green', 'blue', 'yellow', 'violet', 'pink'] as const;
export type Accent = (typeof ACCENTS)[number];

export const ACCENT_IMAGES: Readonly<Record<Accent, string>> = {
  orange,
  green,
  blue,
  yellow,
  violet,
  pink,
};

/** Inline style exposing an accent as `--item-color` for CSS to consume. */
export const accentStyle = (accent: Accent): CSSProperties =>
  ({
    '--item-color': `var(--accent-${accent})`,
    '--item-image': `url("${ACCENT_IMAGES[accent]}")`,
  }) as CSSProperties;
