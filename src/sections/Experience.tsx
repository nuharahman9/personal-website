import { experience } from '../content/experience';
import { site } from '../content/site';
import { TagList } from '../components/TagList/TagList';
import { formatRange } from '../lib/format';
import styles from './sections.module.css';

export function Experience() {
  return (
    <>
      <ol className={styles.stack}>
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <h3 className={styles.itemTitle}>
              {job.role} · {job.company}
            </h3>
            <p className={styles.meta}>{formatRange(job.start, job.end)}</p>
            <p>{job.summary}</p>
            <ul>
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <TagList tags={job.stack} label={`${job.company} stack`} />
          </li>
        ))}
      </ol>
      {site.resumeUrl && (
        <p className={styles.links}>
          <a href={site.resumeUrl} download>
            download résumé (pdf)
          </a>
        </p>
      )}
    </>
  );
}
