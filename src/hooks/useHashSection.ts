import { useCallback, useEffect, useState } from 'react';

function sectionFromHash(hash: string, ids: readonly string[]): string | undefined {
  if (hash.length <= 1) return undefined;
  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return undefined;
  }
  return ids.includes(id) ? id : undefined;
}

interface HashSection {
  activeId: string | undefined;
  close: () => void;
}

export function useHashSection(ids: readonly string[]): HashSection {
  const [activeId, setActiveId] = useState(() => sectionFromHash(window.location.hash, ids));

  useEffect(() => {
    const sync = () => setActiveId(sectionFromHash(window.location.hash, ids));
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [ids]);

  const close = useCallback(() => {
    const { pathname, search } = window.location;
    window.history.pushState(null, '', `${pathname}${search}`);
    setActiveId(undefined);
  }, []);

  return { activeId, close };
}
