import { cn } from '@/shared/lib/utils';
import { ChoiceDialog, type ChoiceDialogOption } from '@/shared/ui/components';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import { useCallback, useState } from 'react';
import { BLOCK_TYPE } from '../../config';
import { useArticleEditor } from '../../model/useArticleEditor';
import { AddContentPanel } from '../AddContentPanel/AddContentPanel';
import { BlockInsertBar } from '../BlockInsertBar/BlockInsertBar';
import { BlockWrapper } from '../BlockWrapper/BlockWrapper';
import { EditorHeader } from '../EditorHeader/EditorHeader';
import { FileBlock } from '../FileBlock/FileBlock';
import { ImageBlock } from '../ImageBlock/ImageBlock';
import { TextBlock } from '../TextBlock/TextBlock';
import { VideoBlock } from '../VideoBlock/VideoBlock';
import styles from './LessonArticleEditor.module.scss';

export interface LessonArticleEditorProps {
  /**
   * Slug существующей статьи. Для нового урока, у которого ещё нет статьи на сервере,
   * не передаётся. Первое сохранение/публикация вызовет onBeforeSave, который создаст
   * цепочку ступень → урок → статья и вернёт slug.
   */
  articleSlug?: string;
  lessonTitle: string;
  /** Встроенная панель в конструкторе курса — без кнопки «Назад». */
  variant?: 'page' | 'embedded';
  /** Для полноэкранного режима (`variant="page"`). */
  onBack?: () => void;
  onLessonTitleChange?: (title: string) => void;
  onDeleteLesson?: () => void;
  /**
   * Вызывается перед первым сохранением/публикацией, когда articleSlug ещё не задан.
   * Должна создать ступень (если нужно) и урок на сервере и вернуть slug созданной статьи.
   */
  onBeforeSave?: () => Promise<string>;
}

export function LessonArticleEditor({
  articleSlug,
  lessonTitle,
  variant = 'embedded',
  onBack,
  onLessonTitleChange,
  onDeleteLesson,
  onBeforeSave,
}: LessonArticleEditorProps) {
  const showSuccess = useSuccess();
  const showError = useError();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const {
    article,
    blocks,
    isLoading,
    isError,
    isDirty,
    isSaving,
    editingBlockId,
    setEditingBlockId,
    isPublished,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    save,
    publish,
    unpublish,
    uploadBlockMedia,
    uploadingBlockId,
  } = useArticleEditor(articleSlug, onBeforeSave);

  const handleBack = useCallback(() => {
    if (!onBack) return;
    if (isDirty) {
      setLeaveDialogOpen(true);
      return;
    }
    onBack();
  }, [isDirty, onBack]);

  const confirmLeave = useCallback(() => {
    setLeaveDialogOpen(false);
    onBack?.();
  }, [onBack]);

  const handleSave = useCallback(async () => {
    try {
      await save();
      showSuccess('Статья сохранена');
    } catch {
      showError('Не удалось сохранить статью');
    }
  }, [save, showSuccess, showError]);

  const handlePublish = useCallback(async () => {
    try {
      await publish();
      showSuccess('Статья опубликована');
    } catch {
      showError('Не удалось опубликовать');
    }
  }, [publish, showSuccess, showError]);

  const handleUnpublish = useCallback(async () => {
    try {
      await unpublish();
      showSuccess('Публикация снята');
    } catch {
      showError('Не удалось снять с публикации');
    }
  }, [unpublish, showSuccess, showError]);

  const leaveOptions: ChoiceDialogOption[] = [
    {
      id: 'stay',
      label: 'Остаться',
      variant: 'secondary',
      onClick: () => setLeaveDialogOpen(false),
    },
    {
      id: 'leave',
      label: 'Выйти без сохранения',
      variant: 'destructive',
      onClick: confirmLeave,
    },
  ];

  const rootClass = cn([
    styles.root,
    variant === 'embedded' ? styles.root_embedded : '',
  ]);

  // Guards only apply when a slug is known — a new lesson has no article yet.
  if (articleSlug && isLoading && !article) {
    return (
      <div className={rootClass}>
        <p className={styles.loading}>Загрузка статьи…</p>
      </div>
    );
  }

  if (articleSlug && !isLoading && (isError || !article)) {
    return (
      <div className={rootClass}>
        <p className={styles.error}>Не удалось загрузить статью</p>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <EditorHeader
        variant={variant}
        lessonTitle={lessonTitle}
        isDirty={isDirty}
        isSaving={isSaving}
        isPublished={isPublished}
        onTitleChange={(t) => (onLessonTitleChange ?? (() => {}))(t)}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onBack={onBack ? handleBack : undefined}
        onDeleteLesson={onDeleteLesson}
      />
      <div className={styles.body}>
        {blocks.length === 0 ? (
          <AddContentPanel variant='empty' onAdd={(type) => addBlock(type)} />
        ) : (
          <>
            <BlockInsertBar
              ariaLabel='Вставить блок перед первым'
              onInsert={(type) => addBlock(type, { before: blocks[0]!.id })}
            />
            {blocks.map((block, index) => {
              const isEditing = editingBlockId === block.id;
              const uploading = uploadingBlockId === block.id;
              return (
                <BlockWrapper
                  key={block.id}
                  isFirst={index === 0}
                  isLast={index === blocks.length - 1}
                  isEditing={isEditing}
                  onEdit={() => setEditingBlockId(block.id)}
                  onMoveUp={() => moveBlock(block.id, 'up')}
                  onMoveDown={() => moveBlock(block.id, 'down')}
                  onDelete={() => deleteBlock(block.id)}
                  onInsertAfter={(type) => addBlock(type, { after: block.id })}
                  showInsertBar
                >
                  {block.type === BLOCK_TYPE.TEXT && (
                    <TextBlock
                      block={block}
                      isEditing={isEditing}
                      onFocus={() => setEditingBlockId(block.id)}
                      onChange={(html) =>
                        updateBlock(block.id, { type: BLOCK_TYPE.TEXT, html })
                      }
                      onBlurEditing={() => setEditingBlockId(null)}
                    />
                  )}
                  {block.type === BLOCK_TYPE.IMAGE && (
                    <ImageBlock
                      block={block}
                      isEditing={isEditing}
                      isUploading={uploading}
                      onUpload={(file) => void uploadBlockMedia(block.id, file)}
                      onAltChange={(alt) =>
                        updateBlock(block.id, {
                          type: BLOCK_TYPE.IMAGE,
                          alt,
                        })
                      }
                      onCaptionChange={(caption) =>
                        updateBlock(block.id, {
                          type: BLOCK_TYPE.IMAGE,
                          caption,
                        })
                      }
                    />
                  )}
                  {block.type === BLOCK_TYPE.VIDEO && (
                    <VideoBlock
                      block={block}
                      isEditing={isEditing}
                      isUploading={uploading}
                      onUpload={(file) => void uploadBlockMedia(block.id, file)}
                      onTitleChange={(title) =>
                        updateBlock(block.id, {
                          type: BLOCK_TYPE.VIDEO,
                          title,
                        })
                      }
                    />
                  )}
                  {block.type === BLOCK_TYPE.FILE && (
                    <FileBlock
                      block={block}
                      isEditing={isEditing}
                      isUploading={uploading}
                      onUpload={(file) => void uploadBlockMedia(block.id, file)}
                      onNameChange={(name) =>
                        updateBlock(block.id, { type: BLOCK_TYPE.FILE, name })
                      }
                    />
                  )}
                </BlockWrapper>
              );
            })}
            <div className={styles.bottomPanel}>
              <AddContentPanel
                variant='bottom'
                onAdd={(type) => addBlock(type)}
              />
            </div>
          </>
        )}
      </div>
      {onBack && (
        <ChoiceDialog
          isOpen={leaveDialogOpen}
          onClose={() => setLeaveDialogOpen(false)}
          title='Несохранённые изменения'
          description='Выйти из редактора? Изменения статьи будут потеряны.'
          options={leaveOptions}
        />
      )}
    </div>
  );
}
