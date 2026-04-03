import { useGetArticleBySlugQuery } from '@/entities/article';
import { SafeHtmlContent } from '@/shared/ui';
import styles from './CourseConstructorLessonArticle.module.scss';

const EMPTY_ARTICLE_HINT =
  'У урока пока нет статьи на сервере. Сохраните изменения — после синхронизации текст подтянется автоматически.';

export interface CourseConstructorLessonArticleProps {
  lessonTitle: string;
  articleSlug: string | null | undefined;
}

export function CourseConstructorLessonArticle({
  lessonTitle,
  articleSlug,
}: CourseConstructorLessonArticleProps) {
  const { data: article, isLoading, isError } = useGetArticleBySlugQuery(
    articleSlug ?? '',
    { skip: !articleSlug },
  );

  if (!articleSlug) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        <p className={styles.hint}>{EMPTY_ARTICLE_HINT}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonBlock} />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        <p className={styles.error}>Не удалось загрузить статью</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
      <SafeHtmlContent
        html={article.contentHtml}
        className={styles.articleBody}
        as="article"
      />
    </div>
  );
}
