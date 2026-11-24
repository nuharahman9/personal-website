import { useEffect, useId, useRef, type ReactNode } from 'react';
import { accentStyle, type Accent } from '../../styles/accents';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  accent: Accent;
  onClose: () => void;
  children: ReactNode;
}

export function Panel({ title, accent, onClose, children }: PanelProps) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      className={styles.panel}
      style={accentStyle(accent)}
    >
      <div className={styles.bar}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          close
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
