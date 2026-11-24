import { site } from '../content/site';
import { ExternalLink } from '../components/ExternalLink/ExternalLink';
import styles from './sections.module.css';

export function Contact() {
  return (
    <div className={styles.prose}>
      <p>Open to new roles and interesting problems. Based in {site.location}.</p>
      <ul className={styles.links}>
        <li>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        {site.socials.map(({ label, href }) => (
          <li key={href}>
            <ExternalLink href={href}>{label}</ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
