import { useGetArticleBySlugQuery } from '@/entities/article';
import { useParams } from '@tanstack/react-router';
import { API_CONFIG } from '@/shared/config/api';
import { Placeholder, SafeHtmlContent } from '@/shared/ui/components';
import styles from './ArticlePage.module.scss';

export const ArticlePage = () => {
  const { slug } = useParams({ from: '/articles/$slug' });
  const { data: article, isLoading, isError } = useGetArticleBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonContent} />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <p className={styles.error}>Статья не найдена</p>
        </div>
      </div>
    );
  }

  const imageUrl = article.imagePreview
    ? article.imagePreview.startsWith('http')
      ? article.imagePreview
      : `${API_CONFIG.BASE_URL?.replace(/\/$/, '')}${article.imagePreview.startsWith('/') ? '' : '/'}${article.imagePreview}`
    : null;

  return (
    <article className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.title}>{article.title}</h1>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className={styles.image}
          />
        ) : (
          <Placeholder className={styles.placeholder} />
        )}
        {article.description && (
          <p className={styles.description}>{article.description}</p>
        )}
        <SafeHtmlContent
          html={article.contentHtml}
          className={styles.content}
        />
      </div>
    </article>
  );
};
