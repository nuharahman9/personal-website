import { projects } from '../content/projects';
import { ExternalLink } from '../components/ExternalLink/ExternalLink';
import { TagList } from '../components/TagList/TagList';
import styles from './sections.module.css';

export function Projects() {
  return (
    <ul className={styles.grid}>
      {projects.map((project) => (
        <li key={project.name} className={styles.card}>
          <h3 className={styles.itemTitle}>{project.name}</h3>
          <p className={styles.meta}>{project.year}</p>
          <p>{project.description}</p>
          <TagList tags={project.stack} label={`${project.name} stack`} />
          <ul className={styles.links}>
            {project.links.map(({ label, href }) => (
              <li key={href}>
                <ExternalLink href={href}>{label}</ExternalLink>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
