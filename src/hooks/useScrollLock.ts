import { useEffect } from 'react';

/** Locks page scroll while `locked` is true; restores the previous value after. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [locked]);
}
