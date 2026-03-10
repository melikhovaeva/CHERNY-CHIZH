import type { ArticleListItem } from '@/entities/article';
import { API_CONFIG } from '@/shared/config/api';
import { Placeholder } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import styles from './ArticleCard.module.scss';

function getImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function formatDescription(description: string): string {
  return description.length > 150
    ? description.slice(0, 150) + '...'
    : description;
}

interface ArticleCardProps {
  article: ArticleListItem;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.imagePreview ?? null);

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
          <Placeholder className={styles.placeholder} />
        )}
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{article.title}</h4>
        {article.description && (
          <p className={styles.description}>
            {formatDescription(article.description)}
          </p>
        )}
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(article.createdAt)}</span>
          {article.author?.displayName && (
            <span className={styles.author}>
              {article.author.avatar && (
                <img
                  src={getImageUrl(article.author.avatar) ?? ''}
                  alt=""
                  className={styles.authorAvatar}
                />
              )}
              <span className={styles.authorName}>
                {article.author.displayName}
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
