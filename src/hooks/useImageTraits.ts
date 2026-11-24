import { useEffect, useState } from 'react';
import { loadImageTraits, type ImageTraits } from '../lib/imageTraits';

interface Loaded {
  src: string;
  traits: ImageTraits;
}

export function useImageTraits(src: string): ImageTraits | undefined {
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    let active = true;
    loadImageTraits(src).then(
      (traits) => {
        if (active) setLoaded({ src, traits });
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, [src]);

  return loaded?.src === src ? loaded.traits : undefined;
}
