import type { InfoType } from '@/shared/config/info';
import {
  Button,
  ChoiceDialog,
  type ChoiceDialogOption,
} from '@/shared/ui/components';
import { useState } from 'react';
import styles from './InfoSettingsActions.module.scss';
import {
  INFO_DELETE_BUTTON_TEXT,
  INFO_PUBLISH_DIALOG_DESCRIPTION,
  INFO_PUBLISH_DIALOG_TITLE,
  INFO_PUBLISH_HINTS,
  INFO_PUBLISH_STATUS,
  INFO_PUBLISH_STATUS_LABEL,
  INFO_UNPUBLISH_DIALOG_DESCRIPTION,
  INFO_UNPUBLISH_DIALOG_TITLE,
  INFO_UNPUBLISH_HINTS,
  type InfoPublishStatus,
} from './model/constants';

export interface InfoSettingsActionsProps {
  infoType: InfoType;
  initialStatus: InfoPublishStatus;
  onPublish?: (nextStatus: InfoPublishStatus) => void;
  onDelete?: () => void;
}

export const InfoSettingsActions = ({
  infoType,
  initialStatus = INFO_PUBLISH_STATUS.UNPUBLISHED,
  onPublish,
  onDelete,
}: InfoSettingsActionsProps) => {
  const [publishStatus, setPublishStatus] =
    useState<InfoPublishStatus>(initialStatus);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO: вынести в store
  const isPublished = publishStatus === INFO_PUBLISH_STATUS.PUBLISHED;

  const handlePublishClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    const nextStatus = isPublished
      ? INFO_PUBLISH_STATUS.UNPUBLISHED
      : INFO_PUBLISH_STATUS.PUBLISHED;

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
              {INFO_PUBLISH_STATUS_LABEL[publishStatus]}
            </span>
          </div>

          <Button className={styles.actionButton} onClick={handlePublishClick}>
            {isPublished ? 'Снять с публикации' : 'Опубликовать'}
          </Button>

          {!isPublished ? (
            <p className={styles.publishHint}>{INFO_PUBLISH_HINTS[infoType]}</p>
          ) : (
            <p className={styles.publishHint}>
              {INFO_UNPUBLISH_HINTS[infoType]}
            </p>
          )}
        </div>

        <div className={styles.deleteBlock}>
          <Button
            variant="destructive"
            className={styles.actionButton}
            onClick={onDelete}
          >
            {INFO_DELETE_BUTTON_TEXT[infoType]}
          </Button>
        </div>
      </div>

      <ChoiceDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        title={
          isPublished
            ? INFO_UNPUBLISH_DIALOG_TITLE[infoType]
            : INFO_PUBLISH_DIALOG_TITLE[infoType]
        }
        description={
          isPublished
            ? INFO_UNPUBLISH_DIALOG_DESCRIPTION[infoType]
            : INFO_PUBLISH_DIALOG_DESCRIPTION[infoType]
        }
        options={dialogOptions}
      />
    </section>
  );
};
