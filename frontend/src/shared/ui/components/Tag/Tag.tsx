import type { InfoTagRead } from '@/shared/api/generated/articles.generated';
import styles from './Tag.module.scss';

interface TagProps {
  tag: InfoTagRead;
  removable?: boolean;
  onRemove?: (tag: InfoTagRead) => void;
}

export const Tag = ({ tag, removable, onRemove }: TagProps) => {
  return (
    <span
      key={tag.id}
      className={`${styles.tag} ${removable ? styles.tag_removable : ''}`}
      data-bg-color={tag.order}
    >
      {tag.label}
      {removable && onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={() => onRemove(tag)}
          aria-label="Удалить тег"
        >
          ×
        </button>
      )}
    </span>
  );
};
