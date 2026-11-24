import { useEffect } from 'react';
import { loadImageTraits } from '../lib/imageTraits';
import { ACCENTS, type Accent } from '../styles/accents';

export function usePhotoAccentColors(images: Readonly<Record<Accent, string>>): void {
  useEffect(() => {
    let active = true;
    const rootStyle = document.documentElement.style;

    for (const accent of ACCENTS) {
      loadImageTraits(images[accent]).then(
        ({ color }) => {
          if (active && color) rootStyle.setProperty(`--accent-${accent}`, color);
        },
        () => {},
      );
    }

    return () => {
      active = false;
      for (const accent of ACCENTS) rootStyle.removeProperty(`--accent-${accent}`);
    };
  }, [images]);
}
