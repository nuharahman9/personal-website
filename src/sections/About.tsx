import { site } from '../content/site';
import { TagList } from '../components/TagList/TagList';
import styles from './sections.module.css';

export function About() {
  return (
    <div className={styles.prose}>
      {site.bio.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {site.skills.map(({ label, items }) => (
        <div key={label} className={styles.group}>
          <h3 className={styles.subheading}>{label}</h3>
          <TagList tags={items} label={label} />
        </div>
      ))}
    </div>
  );
}
