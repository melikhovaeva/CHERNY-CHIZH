import type { ImageBlock as ImageBlockModel } from '@/entities/article';
import { Button } from '@/shared/ui/components/Button/Button';
import { useCallback, useId, useRef, useState } from 'react';
import styles from './ImageBlock.module.scss';

export interface ImageBlockProps {
  block: ImageBlockModel;
  isEditing: boolean;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onAltChange: (alt: string) => void;
  onCaptionChange: (caption: string) => void;
}

export function ImageBlock({
  block,
  isEditing,
  isUploading,
  onUpload,
  onAltChange,
  onCaptionChange,
}: ImageBlockProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file && file.type.startsWith('image/')) onUpload(file);
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
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className={styles.dropzoneHint}>
            Перетащите изображение сюда или нажмите для выбора
          </p>
          {isUploading && <span className={styles.spinner}>Загрузка…</span>}
        </label>
      ) : (
        <>
          <div className={styles.previewWrap}>
            <img
              className={styles.previewImg}
              src={block.url}
              alt={block.alt || ''}
            />
            {isUploading && <span className={styles.spinner}>Загрузка…</span>}
          </div>
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
              accept="image/*"
              aria-hidden
              tabIndex={-1}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </>
      )}
      {isEditing && (
        <div className={styles.metaFields}>
          <label className={styles.fieldLabel} htmlFor={`${inputId}-alt`}>
            Подпись (alt)
          </label>
          <input
            id={`${inputId}-alt`}
            className={styles.textInput}
            type="text"
            value={block.alt}
            onChange={(e) => onAltChange(e.target.value)}
          />
          <label className={styles.fieldLabel} htmlFor={`${inputId}-cap`}>
            Заголовок под изображением
          </label>
          <input
            id={`${inputId}-cap`}
            className={styles.textInput}
            type="text"
            value={block.caption ?? ''}
            onChange={(e) => onCaptionChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
