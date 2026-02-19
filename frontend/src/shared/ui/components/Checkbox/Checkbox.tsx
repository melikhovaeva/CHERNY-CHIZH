import { cn } from '@/shared/lib/utils';
import { useId } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: React.ReactNode;
  name?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
}

export const Checkbox = ({
  checked = false,
  onChange,
  label,
  name,
  id,
  required = false,
  disabled = false,
  className,
  invalid = false,
}: CheckboxProps) => {
  const generatedId = useId();
  const inputId = id ?? `checkbox-${name ?? generatedId}`;

  return (
    <label
      className={cn([styles.root, className ?? ''], {
        [styles.root_disabled]: disabled,
        [styles.root_invalid]: invalid,
      })}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        name={name}
        required={required}
        disabled={disabled}
        aria-checked={checked}
      />
      <span className={styles.box} aria-hidden>
        {checked && <span className={styles.check} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
};
