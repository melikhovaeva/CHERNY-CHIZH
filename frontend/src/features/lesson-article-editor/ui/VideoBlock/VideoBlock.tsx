import { isEmbedUrl, resolveVideoEmbed } from '@/entities/article';
import type { VideoBlock as VideoBlockModel } from '@/entities/article';
import { Button } from '@/shared/ui/components/Button/Button';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import styles from './VideoBlock.module.scss';

const VIDEO_ACCEPT = 'video/mp4,video/webm,video/ogg';

type VideoSourceMode = 'file' | 'url';

export interface VideoBlockProps {
  block: VideoBlockModel;
  isEditing: boolean;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onTitleChange: (title: string) => void;
  onUrlChange: (url: string) => void;
}

function inferMode(block: VideoBlockModel): VideoSourceMode {
  if (block.sourceType) return block.sourceType;
  if (block.url && isEmbedUrl(block.url)) return 'url';
  return 'file';
}

export function VideoBlock({
  block,
  isEditing,
  isUploading,
  onUpload,
  onTitleChange,
  onUrlChange,
}: VideoBlockProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<VideoSourceMode>(() => inferMode(block));
  const [urlDraft, setUrlDraft] = useState(
    block.sourceType === 'url' || isEmbedUrl(block.url) ? block.url : '',
  );

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

  const handleModeSwitch = (next: VideoSourceMode) => {
    setMode(next);
  };

  const handleUrlCommit = () => {
    const trimmed = urlDraft.trim();
    onUrlChange(trimmed);
  };

  const embedInfo = useMemo(() => {
    const src = mode === 'url' ? urlDraft.trim() : block.url;
    return resolveVideoEmbed(src);
  }, [mode, urlDraft, block.url]);

  const isIframe =
    embedInfo.embedType === 'youtube' || embedInfo.embedType === 'vimeo';

  return (
    <div className={styles.root}>
      {/* ── Переключатель режима ── */}
      <div className={styles.modeTabs} role='tablist' aria-label='Источник видео'>
        <button
          type='button'
          role='tab'
          aria-selected={mode === 'file'}
          className={`${styles.modeTab} ${mode === 'file' ? styles.modeTab_active : ''}`}
          onClick={() => handleModeSwitch('file')}
        >
          Файл
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={mode === 'url'}
          className={`${styles.modeTab} ${mode === 'url' ? styles.modeTab_active : ''}`}
          onClick={() => handleModeSwitch('url')}
        >
          Ссылка
        </button>
      </div>

      {/* ── Режим: файл ── */}
      {mode === 'file' && (
        <>
          {!block.url || block.sourceType === 'url' ? (
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
                borderColor: isDragging
                  ? 'var(--accent-primary-color, #41634a)'
                  : undefined,
              }}
            >
              <input
                id={inputId}
                ref={inputRef}
                className={styles.hiddenInput}
                type='file'
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
              <div className={styles.videoFrame}>
                <video
                  className={styles.video}
                  src={block.url}
                  controls
                  preload='metadata'
                />
              </div>
              {block.title && !isEditing && (
                <p className={styles.titleBelow}>{block.title}</p>
              )}
              <div className={styles.replaceRow}>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  Заменить
                </Button>
                <input
                  ref={inputRef}
                  className={styles.hiddenInput}
                  type='file'
                  accept={VIDEO_ACCEPT}
                  aria-hidden
                  tabIndex={-1}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {isUploading && (
                  <span className={styles.spinner}>Загрузка…</span>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Режим: ссылка ── */}
      {mode === 'url' && (
        <div className={styles.urlMode}>
          <label className={styles.fieldLabel} htmlFor={`${inputId}-url`}>
            Ссылка на видео (YouTube, Vimeo или прямой URL)
          </label>
          <div className={styles.urlInputRow}>
            <input
              id={`${inputId}-url`}
              className={styles.textInput}
              type='url'
              placeholder='https://www.youtube.com/watch?v=...'
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onBlur={handleUrlCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlCommit();
                }
              }}
            />
            <Button
              type='button'
              variant='secondary'
              onClick={handleUrlCommit}
              disabled={!urlDraft.trim()}
            >
              Применить
            </Button>
          </div>

          {/* Предпросмотр */}
          {embedInfo.embedUrl && (
            <div className={styles.videoFrame}>
              {isIframe ? (
                <iframe
                  className={styles.embedIframe}
                  src={embedInfo.embedUrl}
                  title={block.title ?? 'Видео'}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              ) : (
                <video
                  className={styles.video}
                  src={embedInfo.embedUrl}
                  controls
                  preload='metadata'
                />
              )}
            </div>
          )}

          {!embedInfo.embedUrl && (
            <p className={styles.dropzoneHint}>
              Введите ссылку и нажмите «Применить»
            </p>
          )}
        </div>
      )}

      {/* ── Поле подписи (общее, когда включён режим редактирования) ── */}
      {isEditing && (
        <div>
          <label className={styles.fieldLabel} htmlFor={`${inputId}-title`}>
            Заголовок / подпись к видео
          </label>
          <input
            id={`${inputId}-title`}
            className={styles.textInput}
            type='text'
            value={block.title ?? ''}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
