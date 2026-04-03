import type { FileBlock as FileBlockModel } from '@/entities/article';
import { Button } from '@/shared/ui/components/Button/Button';
import { useCallback, useId, useRef, useState } from 'react';
import { formatFileSize } from '../../lib/formatFileSize';
import styles from './FileBlock.module.scss';

export interface FileBlockProps {
  block: FileBlockModel;
  isEditing: boolean;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onNameChange: (name: string) => void;
}

export function FileBlock({
  block,
  isEditing,
  isUploading,
  onUpload,
  onNameChange,
}: FileBlockProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file) onUpload(file);
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
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className={styles.dropzoneHint}>
            Перетащите файл сюда или нажмите для выбора
          </p>
          {isUploading && <span className={styles.spinner}>Загрузка…</span>}
        </label>
      ) : (
        <>
          <div className={styles.fileRow}>
            <span className={styles.clip} aria-hidden>
              📎
            </span>
            <a className={styles.link} href={block.url} download={block.name}>
              {block.name || 'Файл'}
            </a>
            <span className={styles.size}>{formatFileSize(block.size)}</span>
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
              aria-hidden
              tabIndex={-1}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {isUploading && <span className={styles.spinner}>Загрузка…</span>}
          </div>
        </>
      )}
      {isEditing && block.url && (
        <div>
          <label className={styles.fieldLabel} htmlFor={`${inputId}-name`}>
            Отображаемое имя
          </label>
          <input
            id={`${inputId}-name`}
            className={styles.textInput}
            type="text"
            value={block.name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
