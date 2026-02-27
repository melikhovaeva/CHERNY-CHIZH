import { Toast } from './Toast';
import styles from './Toast.module.css';
import type { ToastItem, ToastPosition } from './ToastContext';

const positionClass: Record<ToastPosition, string> = {
  'top-left': styles.topLeft,
  'top-right': styles.topRight,
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
};

interface ToastStackProps {
  toasts: ToastItem[];
  position: ToastPosition;
  onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, position, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={`${styles.stack} ${positionClass[position]}`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.slot}${toast.exiting ? ` ${styles.slotExiting}` : ''}`}
        >
          <div className={styles.slotInner}>
            <Toast
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              exiting={toast.exiting}
              onDismiss={onDismiss}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
