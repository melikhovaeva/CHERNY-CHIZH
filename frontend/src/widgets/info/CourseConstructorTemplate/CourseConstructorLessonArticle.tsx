import {
  ArticleContentPreview,
  useGetArticleAdminQuery,
} from '@/entities/article';
import { EditorHeaderPreview } from '@/features/lesson-article-editor';
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
  const {
    data: article,
    isLoading,
    isError,
  } = useGetArticleAdminQuery(articleSlug ?? '', { skip: !articleSlug });

  const taskLine =
    previewTaskTitle != null && previewTaskTitle !== '' ? (
      <p className={styles.previewTask}>{previewTaskTitle}</p>
    ) : null;

  if (!articleSlug) {
    return (
      <div className={styles.root}>
        <EditorHeaderPreview lessonTitle={lessonTitle} />
        <div className={styles.previewBody}>
          {taskLine}
          <p className={styles.hint}>{emptyArticleHint}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <EditorHeaderPreview lessonTitle={lessonTitle} />
        <div className={styles.previewBody}>
          {taskLine}
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonBlock} />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className={styles.root}>
        <EditorHeaderPreview lessonTitle={lessonTitle} />
        <div className={styles.previewBody}>
          {taskLine}
          <p className={styles.error}>Не удалось загрузить статью</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <EditorHeaderPreview lessonTitle={lessonTitle} />
      <div className={styles.previewBody}>
        {taskLine}
        <ArticleContentPreview
          blocks={article.contentBlocks}
          className={styles.articleBody}
          as='article'
        />
      </div>
    </div>
  );
}
