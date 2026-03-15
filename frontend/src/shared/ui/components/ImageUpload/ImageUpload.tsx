import { cn } from '@/shared/lib/utils';
import { Placeholder } from '@/shared/ui/components/Placeholder';
import { useId, useRef } from 'react';
import { FieldLayout } from '../AbstractField/FieldLayout';
import TrashIcon from './assets/trash.svg?react';
import UploadIcon from './assets/upload.svg?react';
import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  label,
  error,
  required,
  className,
  disabled,
}: ImageUploadProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImage = !!value;

  const handleUploadClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange?.(file);
    e.target.value = '';
  };

  return (
    <FieldLayout
      label={label}
      error={error}
      required={required}
      id={id}
      className={className}
    >
      <div className={styles.wrapper}>
        <div
          className={cn([styles.preview], {
            [styles.preview_hasImage]: hasImage,
            [styles.preview_error]: !!error,
          })}
          style={hasImage ? { backgroundImage: `url(${value})` } : undefined}
        >
          {!hasImage && <Placeholder className={styles.placeholder} />}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={cn([styles.actionBtn, styles.actionBtn_upload])}
            onClick={handleUploadClick}
            disabled={disabled}
          >
            <UploadIcon className={styles.actionIcon} aria-hidden />
            <span>Загрузить изображение</span>
          </button>

          {hasImage && (
            <button
              type="button"
              className={cn([styles.actionBtn, styles.actionBtn_delete])}
              onClick={handleDelete}
              disabled={disabled}
            >
              <TrashIcon className={styles.actionIcon} aria-hidden />
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
          disabled={disabled}
          aria-hidden
          tabIndex={-1}
        />
      </div>
    </FieldLayout>
  );
};
