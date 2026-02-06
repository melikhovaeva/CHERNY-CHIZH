import { cn } from '@/shared/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const CHEVRON_DOWN_SRC = '/chevron-down.svg'

export const Select = ({
  label,
  options,
  value,
  onChange,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)
  const isInitialOrAll = !value || options[0]?.value === value
  const displayText = isInitialOrAll ? label : (selectedOption?.label ?? label)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value)
      setIsOpen(false)
    },
    [onChange],
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const longestLabel = options.length
    ? options.reduce((max, o) => (o.label.length > max.length ? o.label : max), options[0].label)
    : label

  return (
    <div className={cn([styles.root, className || ''])} ref={containerRef}>
      <span className={styles.sizer} aria-hidden>
        {longestLabel}
      </span>
      <button
        type="button"
        className={cn([styles.trigger, isOpen ? styles.trigger_open : ''])}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span className={styles.triggerText}>{displayText}</span>
        <span className={styles.chevron}>
          <img src={CHEVRON_DOWN_SRC} alt="" width={16} height={16} />
        </span>
      </button>
      {isOpen && (
        <ul
          className={styles.list}
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                className={cn([
                  styles.option,
                  value === option.value ? styles.option_selected : '',
                ])}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
