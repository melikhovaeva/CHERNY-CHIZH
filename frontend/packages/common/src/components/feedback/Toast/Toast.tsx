import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons';
import styles from './Toast.module.scss';
import type { ToastType } from './ToastContext';

interface ToastProps {
  id: number;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
  exiting?: boolean;
  onDismiss: (id: number) => void;
}

const iconByType: Record<
  ToastType,
  React.ComponentType<{ className?: string }>
> = {
  error: ErrorIcon,
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
};

export function Toast({
  id,
  title,
  message,
  type,
  duration,
  exiting,
  onDismiss,
}: ToastProps) {
  const Icon = iconByType[type];

  const className = [styles.toast, styles[type], exiting && styles.toastExiting]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      role="alert"
      onClick={() => onDismiss(id)}
      style={{ '--toast-duration': `${duration}ms` } as React.CSSProperties}
    >
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <Icon />
          </span>
          <span className={styles.title}>{title}</span>
        </div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} />
      </div>
    </div>
  );
}
