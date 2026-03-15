import { cn } from '@/shared/lib/utils';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './AbstractField.module.scss';
import { useDropdownState } from './hooks/useDropdownState';
import {
  ABSTRACT_FIELD_VARIANT,
  type AbstractFieldInputProps,
  type AbstractFieldInputSelectProps,
  type AbstractFieldProps,
  type AbstractFieldSelectProps,
  type AbstractFieldTextAreaProps,
  type SelectOption,
} from './model/types';

// ────────────────── Input core ──────────────────

function InputCore({
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  autoComplete,
  disabled,
  readOnly,
  id,
  hasError,
}: AbstractFieldInputProps & { hasError: boolean }) {
  return (
    <input
      id={id}
      type={type}
      className={cn([styles.input], {
        [styles.input_invalid]: hasError,
        [styles.input_disabled]: disabled,
      })}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete={autoComplete}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
}

// ────────────────── TextArea core ──────────────────

function TextAreaCore({
  value,
  onChange,
  placeholder,
  rows,
  maxLength,
  disabled,
  readOnly,
  id,
  hasError,
}: AbstractFieldTextAreaProps & { hasError: boolean }) {
  return (
    <textarea
      id={id}
      className={cn([styles.textarea], {
        [styles.textarea_invalid]: hasError,
        [styles.textarea_disabled]: disabled,
      })}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
}

// ────────────────── Select core ──────────────────

const LIST_OPTION_ID_PREFIX = 'abstract-field-select-option-';

function SelectCore({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  label,
  hasError,
}: AbstractFieldSelectProps & { hasError: boolean }) {
  const dropdown = useDropdownState(disabled);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (!dropdown.isOpen || dropdown.isClosing) {
      setHighlightedIndex(null);
      return;
    }
    if (options.length === 0) {
      setHighlightedIndex(null);
      return;
    }
    const valueIndex = options.findIndex((o) => o.value === value);
    setHighlightedIndex(valueIndex >= 0 ? valueIndex : 0);
  }, [dropdown.isOpen, dropdown.isClosing, options, value]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      dropdown.close();
    },
    [onChange, dropdown],
  );

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        if (dropdown.isOpen) {
          e.preventDefault();
          dropdown.close();
          triggerRef.current?.blur();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!dropdown.isOpen) {
          dropdown.open();
          return;
        }
        if (options.length === 0) return;
        setHighlightedIndex((prev) => {
          if (prev === null || prev < 0) return 0;
          return prev < options.length - 1 ? prev + 1 : prev;
        });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!dropdown.isOpen) {
          dropdown.open();
          return;
        }
        if (options.length === 0) return;
        setHighlightedIndex((prev) => {
          if (prev === null || prev <= 0) return options.length - 1;
          return prev - 1;
        });
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (dropdown.isOpen && options.length > 0) {
          const index = highlightedIndex ?? 0;
          const option = options[index];
          if (option) {
            handleSelect(option);
          }
          return;
        }
        if (!dropdown.isOpen) {
          dropdown.toggle();
        }
      }
    },
    [
      dropdown,
      options,
      highlightedIndex,
      handleSelect,
    ],
  );

  const triggerContent = selectedOption ? (
    <span className={styles.triggerText}>{selectedOption.label}</span>
  ) : (
    <span className={styles.triggerPlaceholder}>
      {placeholder ?? 'Выберите...'}
    </span>
  );

  const activeOptionId =
    highlightedIndex != null && options[highlightedIndex]
      ? `${LIST_OPTION_ID_PREFIX}${options[highlightedIndex].value}`
      : undefined;

  return (
    <div className={styles.selectWrapper} ref={dropdown.containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={cn([styles.trigger], {
          [styles.trigger_open]: dropdown.isOpen,
          [styles.trigger_invalid]: hasError,
          [styles.trigger_disabled]: !!disabled,
        })}
        onClick={dropdown.toggle}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-expanded={dropdown.isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        aria-activedescendant={dropdown.isOpen ? activeOptionId : undefined}
      >
        {triggerContent}
        <span
          className={cn([styles.chevron], {
            [styles.chevron_open]: dropdown.isOpen,
          })}
        >
          <ChevronDownIcon width={16} height={16} aria-hidden />
        </span>
      </button>

      {(dropdown.isOpen || dropdown.isClosing) && (
        <div className={styles.listWrapper}>
          <ul
            ref={dropdown.listRef as React.RefObject<HTMLUListElement>}
            className={cn([styles.list], {
              [styles.list_visible]:
                dropdown.isListVisible && !dropdown.isClosing,
              [styles.list_closing]: dropdown.isClosing,
            })}
            role="listbox"
            aria-label={label}
            onTransitionEnd={dropdown.handleListTransitionEnd}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${LIST_OPTION_ID_PREFIX}${option.value}`}
                role="option"
                aria-selected={value === option.value}
              >
                <button
                  type="button"
                  className={cn([styles.option], {
                    [styles.option_selected]: value === option.value,
                    [styles.option_highlighted]: index === highlightedIndex,
                  })}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ────────────────── InputSelect core ──────────────────

const INPUT_SELECT_OPTION_ID_PREFIX = 'abstract-field-input-select-option-';

function InputSelectCore({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  label,
  hasError,
}: AbstractFieldInputSelectProps & { hasError: boolean }) {
  const dropdown = useDropdownState(disabled);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectedOption = options.find((o) => o.value === value);

  const displayValue = useMemo(() => {
    if (dropdown.isOpen) return inputValue;
    return selectedOption?.label ?? '';
  }, [dropdown.isOpen, inputValue, selectedOption]);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    const query = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(query));
  }, [options, inputValue]);

  useEffect(() => {
    if (!dropdown.isOpen || dropdown.isClosing) {
      setHighlightedIndex(null);
      return;
    }
    if (filteredOptions.length === 0) {
      setHighlightedIndex(null);
      return;
    }
    const valueIndex = filteredOptions.findIndex((o) => o.value === value);
    setHighlightedIndex(valueIndex >= 0 ? valueIndex : 0);
  }, [dropdown.isOpen, dropdown.isClosing, filteredOptions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!dropdown.isOpen) {
      dropdown.open();
    }
  };

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      setInputValue('');
      dropdown.close();
    },
    [onChange, dropdown],
  );

  const handleInputFocus = () => {
    dropdown.open();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.close();
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!dropdown.isOpen) {
        dropdown.open();
        return;
      }
      if (filteredOptions.length === 0) return;
      setHighlightedIndex((prev) => {
        if (prev === null || prev < 0) return 0;
        return prev < filteredOptions.length - 1 ? prev + 1 : prev;
      });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!dropdown.isOpen) {
        dropdown.open();
        return;
      }
      if (filteredOptions.length === 0) return;
      setHighlightedIndex((prev) => {
        if (prev === null || prev <= 0) return filteredOptions.length - 1;
        return prev - 1;
      });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (dropdown.isOpen && filteredOptions.length > 0) {
        const index = highlightedIndex ?? 0;
        const option = filteredOptions[index];
        if (option) {
          handleSelect(option);
        }
      }
    }
  };

  const activeOptionId =
    highlightedIndex != null && filteredOptions[highlightedIndex]
      ? `${INPUT_SELECT_OPTION_ID_PREFIX}${filteredOptions[highlightedIndex].value}`
      : undefined;

  return (
    <div className={styles.selectWrapper} ref={dropdown.containerRef}>
      <div
        className={cn([styles.inputSelectField], {
          [styles.inputSelectField_open]: dropdown.isOpen,
          [styles.inputSelectField_invalid]: hasError,
          [styles.inputSelectField_disabled]: !!disabled,
        })}
      >
        <input
          ref={inputRef}
          className={styles.inputSelectInput}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder ?? 'Введите или выберите...'}
          disabled={disabled}
          aria-label={label}
          aria-expanded={dropdown.isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={
            dropdown.isOpen ? activeOptionId : undefined
          }
        />
        <span
          className={cn([styles.inputSelectChevron], {
            [styles.inputSelectChevron_open]: dropdown.isOpen,
          })}
          onClick={disabled ? undefined : dropdown.toggle}
          aria-hidden
        >
          <ChevronDownIcon width={16} height={16} />
        </span>
      </div>

      {(dropdown.isOpen || dropdown.isClosing) && (
        <div className={styles.listWrapper}>
          <ul
            ref={dropdown.listRef as React.RefObject<HTMLUListElement>}
            className={cn([styles.list], {
              [styles.list_visible]:
                dropdown.isListVisible && !dropdown.isClosing,
              [styles.list_closing]: dropdown.isClosing,
            })}
            role="listbox"
            aria-label={label}
            onTransitionEnd={dropdown.handleListTransitionEnd}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${INPUT_SELECT_OPTION_ID_PREFIX}${option.value}`}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <button
                    type="button"
                    className={cn([styles.option], {
                      [styles.option_selected]: value === option.value,
                      [styles.option_highlighted]: index === highlightedIndex,
                    })}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span className={cn([styles.option, styles.option_selected])}>
                  Ничего не найдено
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ────────────────── AbstractField ──────────────────

export const AbstractField = (props: AbstractFieldProps) => {
  const generatedId = useId();
  const fieldId = props.id ?? generatedId;
  const hasError = !!props.error;

  let control: React.ReactNode;

  switch (props.variant) {
    case ABSTRACT_FIELD_VARIANT.INPUT:
      control = <InputCore {...props} id={fieldId} hasError={hasError} />;
      break;
    case ABSTRACT_FIELD_VARIANT.TEXT_AREA:
      control = <TextAreaCore {...props} id={fieldId} hasError={hasError} />;
      break;
    case ABSTRACT_FIELD_VARIANT.SELECT:
      control = <SelectCore {...props} hasError={hasError} />;
      break;
    case ABSTRACT_FIELD_VARIANT.INPUT_SELECT:
      control = <InputSelectCore {...props} hasError={hasError} />;
      break;
  }

  return (
    <div className={cn([styles.root, props.className ?? ''])}>
      {props.label && (
        <label className={styles.label} htmlFor={fieldId}>
          {props.label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.control}>{control}</div>

      {props.helperText && !hasError && (
        <span className={styles.helperText}>{props.helperText}</span>
      )}

      <span
        className={cn([styles.error], {
          [styles.error_visible]: hasError,
        })}
        role={hasError ? 'alert' : undefined}
      >
        {props.error || '\u00A0'}
      </span>
    </div>
  );
};
