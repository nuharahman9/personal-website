import { Bands } from './components/Bands/Bands';
import { Panel } from './components/Panel/Panel';
import { site } from './content/site';
import { useHashSection } from './hooks/useHashSection';
import { usePhotoAccentColors } from './hooks/usePhotoAccentColors';
import { useScrollLock } from './hooks/useScrollLock';
import { sectionIds, sections } from './sections/registry';
import { ACCENT_IMAGES } from './styles/accents';
import styles from './App.module.css';

export function App() {
  usePhotoAccentColors(ACCENT_IMAGES);
  const { activeId, close } = useHashSection(sectionIds);
  const active = sections.find(({ id }) => id === activeId);
  const isPanelOpen = active !== undefined;

  useScrollLock(isPanelOpen);

  return (
    <>
      <div className={styles.home} inert={isPanelOpen}>
        <header className={styles.header}>
          <h1 className={styles.name}>{site.name}</h1>
        </header>
        <main className={styles.main}>
          <Bands items={sections} activeId={activeId} />
        </main>
      </div>
      {active && (
        <Panel key={active.id} title={active.label} accent={active.accent} onClose={close}>
          <active.Component />
        </Panel>
      )}
    </>
  );
}
