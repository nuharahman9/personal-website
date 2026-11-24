import { articles } from '../content/articles';
import { ExternalLink } from '../components/ExternalLink/ExternalLink';
import { formatDay, sortByDateDesc } from '../lib/format';
import styles from './sections.module.css';

// Sorted once at module load; content is static.
const sorted = sortByDateDesc(articles);

export function Writing() {
  if (sorted.length === 0) return <p className={styles.empty}>no transmissions yet.</p>;
  return (
    <ol className={styles.stack}>
      {sorted.map((article) => (
        <li key={article.href}>
          <h3 className={styles.itemTitle}>
            <ExternalLink href={article.href}>{article.title}</ExternalLink>
          </h3>
          <p className={styles.meta}>
            <time dateTime={article.date}>{formatDay(article.date)}</time>
          </p>
          {article.summary && <p>{article.summary}</p>}
        </li>
      ))}
    </ol>
  );
}
