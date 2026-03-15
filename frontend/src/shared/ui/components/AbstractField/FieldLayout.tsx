import { cn } from '@/shared/lib/utils';
import styles from './AbstractField.module.scss';

export interface FieldLayoutProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const FieldLayout = ({
  label,
  error,
  helperText,
  required,
  id,
  className,
  children,
}: FieldLayoutProps) => {
  const hasError = !!error;

  return (
    <div className={cn([styles.root, className ?? ''])}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.control}>{children}</div>

      {helperText && !hasError && (
        <span className={styles.helperText}>{helperText}</span>
      )}

      <span
        className={cn([styles.error], {
          [styles.error_visible]: hasError,
        })}
        role={hasError ? 'alert' : undefined}
      >
        {error || '\u00A0'}
      </span>
    </div>
  );
};
