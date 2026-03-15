import { Button } from '@/shared/ui/components';
import { useState } from 'react';
import styles from './CourseActionsSection.module.scss';
import {
  COURSE_PUBLISH_STATUS,
  COURSE_PUBLISH_STATUS_LABEL,
  type CoursePublishStatus,
} from './model/constants';

export interface CourseActionsSectionProps {
  initialStatus?: CoursePublishStatus;
  onPublish?: () => void;
  onDelete?: () => void;
}

export const CourseActionsSection = ({
  initialStatus = COURSE_PUBLISH_STATUS.UNPUBLISHED,
  onPublish,
  onDelete,
}: CourseActionsSectionProps) => {
  const [publishStatus, setPublishStatus] =
    useState<CoursePublishStatus>(initialStatus);

  // TODO: вынести в store
  const isPublished = publishStatus === COURSE_PUBLISH_STATUS.PUBLISHED;

  const handlePublishClick = () => {
    setPublishStatus(
      isPublished
        ? COURSE_PUBLISH_STATUS.UNPUBLISHED
        : COURSE_PUBLISH_STATUS.PUBLISHED,
    );
    onPublish?.();
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Действия</h2>

      <div className={styles.body}>
        <div className={styles.publishBlock}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Статус</span>
            <span className={styles.statusValue} data-published={isPublished}>
              {COURSE_PUBLISH_STATUS_LABEL[publishStatus]}
            </span>
          </div>

          <Button className={styles.actionButton} onClick={handlePublishClick}>
            {isPublished ? 'Снять с публикации' : 'Опубликовать'}
          </Button>

          {!isPublished && (
            <p className={styles.publishHint}>
              Курс станет доступным для прохождения
            </p>
          )}
        </div>

        <div className={styles.deleteBlock}>
          <Button
            variant="destructive"
            className={styles.actionButton}
            onClick={onDelete}
          >
            Удалить курс
          </Button>
        </div>
      </div>
    </section>
  );
};
