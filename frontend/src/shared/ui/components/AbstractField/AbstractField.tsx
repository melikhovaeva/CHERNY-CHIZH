import { cn } from '@/shared/lib/utils';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import { useCallback, useId, useMemo, useState } from 'react';
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
  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      dropdown.close();
    },
    [onChange, dropdown],
  );

  const triggerContent = selectedOption ? (
    <span className={styles.triggerText}>{selectedOption.label}</span>
  ) : (
    <span className={styles.triggerPlaceholder}>
      {placeholder ?? 'Выберите...'}
    </span>
  );

  return (
    <div className={styles.selectWrapper} ref={dropdown.containerRef}>
      <button
        type="button"
        className={cn([styles.trigger], {
          [styles.trigger_open]: dropdown.isOpen,
          [styles.trigger_invalid]: hasError,
          [styles.trigger_disabled]: !!disabled,
        })}
        onClick={dropdown.toggle}
        disabled={disabled}
        aria-expanded={dropdown.isOpen}
        aria-haspopup="listbox"
        aria-label={label}
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
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
              >
                <button
                  type="button"
                  className={cn([styles.option], {
                    [styles.option_selected]: value === option.value,
                  })}
                  onClick={() => handleSelect(option)}
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
  const [inputValue, setInputValue] = useState('');

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
    if (e.key === 'Escape' && dropdown.isOpen) {
      e.preventDefault();
      dropdown.close();
    }
  };

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
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <button
                    type="button"
                    className={cn([styles.option], {
                      [styles.option_selected]: value === option.value,
                    })}
                    onClick={() => handleSelect(option)}
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
