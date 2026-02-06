import { cn } from '@/shared/lib/utils'
import styles from './Checkbox.module.scss'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label: string
  name?: string
  id?: string
  disabled?: boolean
  className?: string
}

export const Checkbox = ({
  checked = false,
  onChange,
  label,
  name,
  id,
  disabled = false,
  className,
}: CheckboxProps) => {
  const inputId = id ?? `checkbox-${name ?? label.replace(/\s/g, '-').toLowerCase()}`

  return (
    <label className={cn([styles.root, className ?? ''], { [styles.root_disabled]: disabled })} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        name={name}
        disabled={disabled}
        aria-checked={checked}
      />
      <span className={styles.box} aria-hidden>
        {checked && <span className={styles.check} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}
