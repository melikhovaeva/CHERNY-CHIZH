import type { ArticleListItem } from '@/entities/article';
import { API_CONFIG } from '@/shared/config/api';
import { Placeholder } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import styles from './ArticleCard.module.scss';

function getImageUrl(imagePreview: string | null): string | undefined {
  if (!imagePreview) return undefined;
  if (imagePreview.startsWith('http')) return imagePreview;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${imagePreview.startsWith('/') ? '' : '/'}${imagePreview}`;
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

interface ArticleCardProps {
  article: ArticleListItem;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.imagePreview);

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className={styles.image}
          />
        ) : (
          <Placeholder className={styles.placeholder} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        {article.description && (
          <p className={styles.description}>{article.description}</p>
        )}
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(article.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
