import { useGetArticleBySlugQuery } from '@/entities/article';
import { useParams } from '@tanstack/react-router';
import { API_CONFIG } from '@/shared/config/api';
import { Placeholder } from '@/shared/ui/components';
import styles from './ArticlePage.module.scss';

function renderMarkdownContent(content: string) {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} className={styles.contentH2}>
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={index} className={styles.contentH1}>
          {trimmed.slice(2)}
        </h1>
      );
    }
    return (
      <p key={index} className={styles.contentP}>
        {trimmed.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < trimmed.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

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
        <div className={styles.content}>
          {renderMarkdownContent(article.content)}
        </div>
      </div>
    </article>
  );
};
