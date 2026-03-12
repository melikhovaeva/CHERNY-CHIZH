import { cn } from '@/shared/lib/utils';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  variant?: 'default' | 'input';
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
}

export const Select = ({
  label,
  options,
  value,
  variant = 'default',
  onChange,
  className,
  placeholder,
  error,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const isInitialOrAllDefault =
    !value || (variant === 'default' && options[0]?.value === value);
  const displayTextDefault = isInitialOrAllDefault
    ? label
    : selectedOption?.label ?? label;

  const isInputVariant = variant === 'input';
  const displayTextInput = selectedOption?.label ?? placeholder ?? '';

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, handleClose]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleListTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLUListElement>) => {
      if (e.target !== listRef.current || e.propertyName !== 'transform')
        return;
      if (isClosing) {
        setIsOpen(false);
        setIsClosing(false);
      }
    },
    [isClosing],
  );

  useLayoutEffect(() => {
    if (isOpen && !isClosing) {
      const id = requestAnimationFrame(() => setIsListVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (!isOpen) setIsListVisible(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  const longestLabel = options.length
    ? options.reduce(
        (max, o) => (o.label.length > max.length ? o.label : max),
        options[0].label,
      )
    : label;

  const triggerContent =
    isInputVariant && !value ? (
      <span className={styles.triggerPlaceholder}>{displayTextInput}</span>
    ) : (
      <span className={styles.triggerText}>
        {isInputVariant ? displayTextInput : displayTextDefault}
      </span>
    );

  const selectCore = (
    <>
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
        {triggerContent}
        <span
          className={cn([styles.chevron, isOpen ? styles.chevron_open : ''])}
        >
          <ChevronDownIcon width={16} height={16} aria-hidden />
        </span>
      </button>
      {(isOpen || isClosing) && (
        <div className={styles.listWrapper}>
          <ul
            ref={listRef}
            className={cn([
              styles.list,
              isListVisible && !isClosing ? styles.list_visible : '',
              isClosing ? styles.list_closing : '',
            ])}
            role="listbox"
            aria-label={label}
            onTransitionEnd={handleListTransitionEnd}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
              >
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
        </div>
      )}
    </>
  );

  if (isInputVariant) {
    const hasError = !!error;

    return (
      <div className={styles.field}>
        <span className={styles.label}>{label}</span>
        <div
          className={cn([
            styles.root,
            isOpen || isClosing ? styles.root_open : '',
            className || '',
            styles.variant_input,
            hasError ? styles.variant_inputInvalid : '',
          ])}
          ref={containerRef}
        >
          {selectCore}
        </div>
        <span
          className={cn([styles.error, hasError ? styles.error_visible : ''])}
          role={hasError ? 'alert' : undefined}
        >
          {error || '\u00A0'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn([
        styles.root,
        isOpen || isClosing ? styles.root_open : '',
        className || '',
        styles[`variant_${variant}`],
      ])}
      ref={containerRef}
    >
      {selectCore}
    </div>
  );
};
