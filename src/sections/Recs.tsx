import { recs } from '../content/recs';
import { ExternalLink } from '../components/ExternalLink/ExternalLink';
import styles from './sections.module.css';

export function Recs() {
  return (
    <div className={styles.grid}>
      {recs.map((category) => (
        <section key={category.id} aria-labelledby={`recs-${category.id}`} className={styles.card}>
          <h3 id={`recs-${category.id}`} className={styles.subheading}>
            {category.label}
          </h3>
          <ul className={styles.compact}>
            {category.items.map((rec) => (
              <li key={`${rec.title}-${rec.by}`}>
                {rec.href ? <ExternalLink href={rec.href}>{rec.title}</ExternalLink> : rec.title}
                <span className={styles.meta}> — {rec.by}</span>
                {rec.note && <p className={styles.meta}>{rec.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
