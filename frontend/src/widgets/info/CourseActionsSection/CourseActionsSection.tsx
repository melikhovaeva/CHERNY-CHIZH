import { Button, ChoiceDialog, type ChoiceDialogOption } from '@/shared/ui/components';
import { useState } from 'react';
import styles from './CourseActionsSection.module.scss';
import {
  COURSE_PUBLISH_STATUS,
  COURSE_PUBLISH_STATUS_LABEL,
  type CoursePublishStatus,
} from './model/constants';

export interface CourseActionsSectionProps {
  initialStatus: CoursePublishStatus;
  onPublish?: (nextStatus: CoursePublishStatus) => void;
  onDelete?: () => void;
}

export const CourseActionsSection = ({
  initialStatus = COURSE_PUBLISH_STATUS.UNPUBLISHED,
  onPublish,
  onDelete,
}: CourseActionsSectionProps) => {
  const [publishStatus, setPublishStatus] =
    useState<CoursePublishStatus>(initialStatus);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO: вынести в store
  const isPublished = publishStatus === COURSE_PUBLISH_STATUS.PUBLISHED;

  const handlePublishClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    const nextStatus = isPublished
      ? COURSE_PUBLISH_STATUS.UNPUBLISHED
      : COURSE_PUBLISH_STATUS.PUBLISHED;

    setPublishStatus(nextStatus);
    onPublish?.(nextStatus);
    setIsDialogOpen(false);
  };

  const dialogOptions: ChoiceDialogOption[] = [
    {
      id: 'confirm',
      label: isPublished ? 'Снять с публикации' : 'Опубликовать',
      variant: isPublished ? 'destructive' : 'primary',
      onClick: handleConfirm,
    },
    {
      id: 'cancel',
      label: 'Отменить',
      variant: 'secondary',
      onClick: handleDialogClose,
    },
  ];

  return (
    <section className={styles.root}>
      <h4>Действия</h4>

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

          {!isPublished ? (
            <p className={styles.publishHint}>
              Курс станет доступным для прохождения
            </p>
          ) : (
            <p className={styles.publishHint}>
              Все ученики потеряют доступ к курсу
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

      <ChoiceDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        title={
          isPublished ? 'Снять курс с публикации?' : 'Опубликовать курс?'
        }
        description={
          isPublished
            ? 'После снятия с публикации ученики потеряют доступ к курсу.'
            : 'После публикации курс станет доступным для прохождения.'
        }
        options={dialogOptions}
      />
    </section>
  );
};
