import type { InfoTagRead } from '@/shared/api/generated/articles.generated';
import styles from './Tag.module.scss';

interface TagProps {
  tag: InfoTagRead;
}

export const Tag = ({ tag }: TagProps) => {
  return (
    <span key={tag.id} className={styles.tag} data-bg-color={tag.order}>
      {tag.label}
    </span>
  );
};
