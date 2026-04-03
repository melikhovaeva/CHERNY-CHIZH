import type { VideoBlock as VideoBlockModel } from '@/entities/article';
import { Button } from '@/shared/ui/components/Button/Button';
import { useCallback, useId, useRef, useState } from 'react';
import styles from './VideoBlock.module.scss';

const VIDEO_ACCEPT = 'video/mp4,video/webm,video/ogg';

export interface VideoBlockProps {
  block: VideoBlockModel;
  isEditing: boolean;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onTitleChange: (title: string) => void;
}

export function VideoBlock({
  block,
  isEditing,
  isUploading,
  onUpload,
  onTitleChange,
}: VideoBlockProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (file.type.startsWith('video/')) onUpload(file);
    },
    [onUpload],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={styles.root}>
      {!block.url ? (
        <label
          className={styles.dropzone}
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            borderColor: isDragging ? 'var(--accent-primary-color, #41634a)' : undefined,
          }}
        >
          <input
            id={inputId}
            ref={inputRef}
            className={styles.hiddenInput}
            type="file"
            accept={VIDEO_ACCEPT}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className={styles.dropzoneHint}>
            Перетащите видео (MP4, WebM, Ogg) или выберите файл
          </p>
          {isUploading && <span className={styles.spinner}>Загрузка…</span>}
        </label>
      ) : (
        <>
          <video
            className={styles.video}
            src={block.url}
            controls
            preload="metadata"
          />
          {block.title && !isEditing && (
            <p className={styles.titleBelow}>{block.title}</p>
          )}
          <div className={styles.replaceRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              Заменить
            </Button>
            <input
              ref={inputRef}
              className={styles.hiddenInput}
              type="file"
              accept={VIDEO_ACCEPT}
              aria-hidden
              tabIndex={-1}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {isUploading && <span className={styles.spinner}>Загрузка…</span>}
          </div>
        </>
      )}
      {isEditing && (
        <div>
          <label className={styles.fieldLabel} htmlFor={`${inputId}-title`}>
            Заголовок / подпись к видео
          </label>
          <input
            id={`${inputId}-title`}
            className={styles.textInput}
            type="text"
            value={block.title ?? ''}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
