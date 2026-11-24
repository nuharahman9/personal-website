import { useEffect, useRef, type Ref } from 'react';
import { useImageTraits } from '../../hooks/useImageTraits';
import { ACCENT_IMAGES, accentStyle, type Accent } from '../../styles/accents';
import styles from './Bands.module.css';

export interface BandItem {
  id: string;
  label: string;
  accent: Accent;
}

interface BandsProps {
  items: readonly BandItem[];
  activeId: string | undefined;
}

function useReturnFocus(activeId: string | undefined) {
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const previousId = useRef(activeId);

  useEffect(() => {
    const closedId = previousId.current;
    previousId.current = activeId;
    if (activeId === undefined && closedId !== undefined) links.current.get(closedId)?.focus();
  }, [activeId]);

  return (id: string) => (element: HTMLAnchorElement | null) => {
    if (element) links.current.set(id, element);
    else links.current.delete(id);
  };
}

interface BandProps extends BandItem {
  linkRef: Ref<HTMLAnchorElement>;
}

function Band({ id, label, accent, linkRef }: BandProps) {
  const isPortrait = useImageTraits(ACCENT_IMAGES[accent])?.isPortrait ?? false;

  return (
    <a ref={linkRef} href={`#${id}`} className={styles.band} style={accentStyle(accent)}>
      <span
        className={styles.image}
        data-orientation={isPortrait ? 'portrait' : 'landscape'}
        aria-hidden="true"
      />
      <span className={styles.label}>{label}</span>
    </a>
  );
}

export function Bands({ items, activeId }: BandsProps) {
  const registerLink = useReturnFocus(activeId);

  return (
    <nav aria-label="Sections" className={styles.nav}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Band {...item} linkRef={registerLink(item.id)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
