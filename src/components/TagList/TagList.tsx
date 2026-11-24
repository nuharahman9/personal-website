import styles from './TagList.module.css';

interface TagListProps {
  tags: readonly string[];
  label: string;
}

export function TagList({ tags, label }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <ul className={styles.tags} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
