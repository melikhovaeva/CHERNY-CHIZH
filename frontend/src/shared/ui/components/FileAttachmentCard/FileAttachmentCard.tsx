import type { JSX } from 'react';
import styles from './FileAttachmentCard.module.scss';

export interface FileAttachmentCardProps {
  href: string;
  fileName: string;
  fileSizeLabel: string;
  download?: string;
}

function DownloadIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        d='M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M5 21h14'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

/**
 * Карточка вложения: имя и размер слева, кнопка скачивания справа (CRM-акцент).
 */
export function FileAttachmentCard({
  href,
  fileName,
  fileSizeLabel,
  download,
}: FileAttachmentCardProps): JSX.Element {
  const label = fileName.trim() || 'Файл';
  const downloadName = download ?? label;

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <a className={styles.fileName} href={href} download={downloadName}>
          {label}
        </a>
        <p className={styles.size}>{fileSizeLabel}</p>
      </div>
      <a
        className={styles.downloadBtn}
        href={href}
        download={downloadName}
        aria-label={`Скачать ${label}`}
        title='Скачать'
      >
        <DownloadIcon className={styles.downloadIcon} />
      </a>
    </div>
  );
}
