import type { ArticleListItem } from '@/entities/article';
import { formatDate, getImageUrl } from '@/shared';
import { Placeholder } from '@/shared/ui/components';
import { Tag } from '@/shared/ui/components/Tag/Tag';
import { Link } from '@tanstack/react-router';
import styles from './ArticleCard.module.scss';

const ARTICLE_STATUS_PUBLISHED = 'published';

interface ArticleCardProps {
  article: ArticleListItem;
  status?: { code: string; label: string } | null;
  className?: string;
}

export function ArticleCard({ article, status, className }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.imagePreview ?? null);
  const dateStr = formatDate(article.createdAt);

  const statusClassName =
    status?.code === ARTICLE_STATUS_PUBLISHED
      ? `${styles.status} ${styles.statusPublished}`
      : `${styles.status} ${styles.statusUnpublished}`;

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <Placeholder className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.panel}>
        {article.tags.length > 0 && (
          <div className={styles.tagsRow}>
            {article.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        <h4 className={styles.title}>{article.title}</h4>
        {article.description && (
          <p className={[styles.description, styles.descriptionClamp].join(' ')}>
            {article.description}
          </p>
        )}
        <div className={styles.footer}>
          {status && (
            <span className={statusClassName}>{status.label}</span>
          )}
          <span className={styles.date}>{dateStr}</span>
        </div>
      </div>
    </Link>
  );
}
