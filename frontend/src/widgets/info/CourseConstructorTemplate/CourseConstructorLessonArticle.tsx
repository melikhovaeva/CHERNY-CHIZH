import { useGetArticleAdminQuery } from '@/entities/article';
import { SafeHtmlContent } from '@/shared/ui';
import styles from './CourseConstructorLessonArticle.module.scss';

const EMPTY_ARTICLE_HINT_DEFAULT =
  'У урока пока нет статьи на сервере. Сохраните изменения — после синхронизации текст подтянется автоматически.';

export interface CourseConstructorLessonArticleProps {
  lessonTitle: string;
  articleSlug: string | null | undefined;
  /** Подзаголовок (например, выбранное задание в режиме предпросмотра). */
  previewTaskTitle?: string | null;
  /** Текст, если у урока нет slug статьи (например, для ученика). */
  emptyArticleHint?: string;
}

export function CourseConstructorLessonArticle({
  lessonTitle,
  articleSlug,
  previewTaskTitle,
  emptyArticleHint = EMPTY_ARTICLE_HINT_DEFAULT,
}: CourseConstructorLessonArticleProps) {
  const { data: article, isLoading, isError } = useGetArticleAdminQuery(
    articleSlug ?? '',
    { skip: !articleSlug },
  );

  const taskLine =
    previewTaskTitle != null && previewTaskTitle !== '' ? (
      <p className={styles.previewTask}>{previewTaskTitle}</p>
    ) : null;

  if (!articleSlug) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        {taskLine}
        <p className={styles.hint}>{emptyArticleHint}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        {taskLine}
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonBlock} />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className={styles.root}>
        <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
        {taskLine}
        <p className={styles.error}>Не удалось загрузить статью</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.lessonHeading}>{lessonTitle}</h2>
      {taskLine}
      <SafeHtmlContent
        html={article.contentHtml}
        className={styles.articleBody}
        as="article"
      />
    </div>
  );
}
