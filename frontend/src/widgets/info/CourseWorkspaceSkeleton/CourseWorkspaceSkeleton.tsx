import { Skeleton } from '@/shared/ui/components';
import styles from './CourseWorkspaceSkeleton.module.scss';

const STAGE_TITLE_HEIGHT = 22;
const LESSON_LINE_HEIGHT = 14;
const CONTENT_TITLE_HEIGHT = 28;
const BODY_LINE_HEIGHT = 14;
const BODY_BLOCK_HEIGHT = 220;

export function CourseWorkspaceSkeleton() {
  return (
    <div
      className={styles.root}
      aria-busy="true"
      aria-live="polite"
      aria-label="Загрузка программы курса"
    >
      <div className={styles.left}>
        <div className={styles.stageBlock}>
          <Skeleton
            variant="rect"
            height={STAGE_TITLE_HEIGHT}
            width="72%"
            className={styles.stageTitle}
          />
          <div className={styles.lessonStack}>
            <Skeleton
              variant="rect"
              height={LESSON_LINE_HEIGHT}
              width="88%"
              className={styles.lessonLine}
            />
            <Skeleton
              variant="rect"
              height={LESSON_LINE_HEIGHT}
              width="76%"
              className={styles.lessonLine}
            />
            <Skeleton
              variant="rect"
              height={LESSON_LINE_HEIGHT}
              width="64%"
              className={styles.lessonLine}
            />
          </div>
        </div>
        <div className={styles.stageBlock}>
          <Skeleton
            variant="rect"
            height={STAGE_TITLE_HEIGHT}
            width="68%"
            className={styles.stageTitle}
          />
          <div className={styles.lessonStack}>
            <Skeleton
              variant="rect"
              height={LESSON_LINE_HEIGHT}
              width="84%"
              className={styles.lessonLine}
            />
            <Skeleton
              variant="rect"
              height={LESSON_LINE_HEIGHT}
              width="70%"
              className={styles.lessonLine}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <Skeleton
          variant="rect"
          height={CONTENT_TITLE_HEIGHT}
          width="48%"
          className={styles.titleLine}
        />
        <div className={styles.bodyLines}>
          <Skeleton
            variant="rect"
            height={BODY_LINE_HEIGHT}
            width="100%"
            className={styles.bodyLine}
          />
          <Skeleton
            variant="rect"
            height={BODY_LINE_HEIGHT}
            width="100%"
            className={styles.bodyLine}
          />
          <Skeleton
            variant="rect"
            height={BODY_LINE_HEIGHT}
            width="92%"
            className={styles.bodyLine}
          />
        </div>
        <Skeleton
          variant="rect"
          width="100%"
          height={BODY_BLOCK_HEIGHT}
          className={styles.bodyBlock}
        />
      </div>
    </div>
  );
}
