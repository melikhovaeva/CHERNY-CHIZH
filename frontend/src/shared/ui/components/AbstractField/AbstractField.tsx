import { cn } from '@/shared/lib/utils';
import EyeOffIcon from '@/shared/ui/components/Input/assets/eye-off.svg?react';
import EyeIcon from '@/shared/ui/components/Input/assets/eye.svg?react';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './AbstractField.module.scss';
import { FieldLayout } from './FieldLayout';
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

const InputCore = forwardRef<
  HTMLInputElement,
  AbstractFieldInputProps & { hasError: boolean }
>(function InputCore(
  {
    value,
    onChange,
    placeholder,
    type = 'text',
    iconLeft,
    iconRight,
    maxLength,
    autoComplete,
    disabled,
    readOnly,
    id,
    hasError,
    showPasswordToggle,
    actionButton,
    name,
    onBlur,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUncontrolled = value === undefined;
  const isPassword = type === 'password';
  const hasToggle = showPasswordToggle ?? isPassword;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resolvedType =
    isPassword && hasToggle && passwordVisible ? 'text' : type;

  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        el;
      if (typeof ref === 'function') ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    },
    [ref],
  );

  useEffect(() => {
    if (!isUncontrolled || !onChange) return;
    const el = inputRef.current;
    if (!el) return;
    const syncValue = () => onChange(el.value);
    el.addEventListener('change', syncValue);
    el.addEventListener('input', syncValue);
    return () => {
      el.removeEventListener('change', syncValue);
      el.removeEventListener('input', syncValue);
    };
  }, [isUncontrolled, onChange]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isUncontrolled && onChange && e.target.value !== undefined) {
        onChange(e.target.value);
      }
      onBlur?.(e);
    },
    [isUncontrolled, onChange, onBlur],
  );

  const inputEl = (
    <div className={styles.inputWrapper}>
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      <input
        ref={setRefs}
        id={id}
        name={name}
        type={resolvedType}
        className={cn([styles.input], {
          [styles.input_invalid]: hasError,
          [styles.input_disabled]: disabled,
          [styles.input_readOnly]: readOnly,
          [styles.withToggle]: hasToggle && !actionButton,
          [styles.input_iconLeft]: !!iconLeft,
          [styles.input_iconRight]: !!iconRight,
        })}
        {...(value !== undefined && { value: value ?? '' })}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
      />
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </div>
  );

  if (hasToggle && !actionButton) {
    return (
      <div className={styles.inputWrapper}>
        {inputEl}
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setPasswordVisible((v) => !v)}
          tabIndex={-1}
          aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    );
  }

  if (actionButton) {
    return (
      <div className={styles.inputWrapper}>
        {inputEl}
        {actionButton}
      </div>
    );
  }

  return inputEl;
});

// ────────────────── TextArea core ──────────────────

const TextAreaCore = forwardRef<
  HTMLTextAreaElement,
  AbstractFieldTextAreaProps & { hasError: boolean }
>(function TextAreaCore(
  {
    value,
    onChange,
    placeholder,
    rows,
    maxLength,
    disabled,
    readOnly,
    id,
    hasError,
    name,
    onBlur,
  },
  ref,
) {
  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      className={cn([styles.textarea], {
        [styles.textarea_invalid]: hasError,
        [styles.textarea_disabled]: disabled,
        [styles.textarea_readOnly]: readOnly,
      })}
      {...(value !== undefined && { value: value ?? '' })}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
});

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
  styleVariant,
}: AbstractFieldSelectProps & { hasError: boolean }) {
  const isDefault = styleVariant === 'default';
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
    [dropdown, options, highlightedIndex, handleSelect],
  );

  const triggerContent = selectedOption ? (
    <span className={styles.triggerText}>{selectedOption.label}</span>
  ) : (
    <span className={styles.triggerPlaceholder}>
      {placeholder ?? 'Выберите...'}
    </span>
  );

  const placeholderText = placeholder ?? 'Выберите...';

  const activeOptionId =
    highlightedIndex != null && options[highlightedIndex]
      ? `${LIST_OPTION_ID_PREFIX}${options[highlightedIndex].value}`
      : undefined;

  return (
    <div
      className={cn([styles.selectWrapper], {
        [styles.selectWrapper_default]: isDefault,
        [styles.selectWrapper_input]: !isDefault,
      })}
      ref={dropdown.containerRef}
    >
      <div
        className={cn([styles.selectInner], {
          [styles.selectInner_input]: !isDefault,
        })}
      >
        {isDefault && (
          <div className={styles.selectSizer} aria-hidden>
            <div className={styles.selectSizerLabels}>
              {options.map((option) => (
                <span key={option.value} className={styles.selectSizerLine}>
                  {option.label}
                </span>
              ))}
              <span className={styles.selectSizerLine}>{placeholderText}</span>
            </div>
            <span className={styles.selectSizerChevron} />
          </div>
        )}
        <button
          ref={triggerRef}
          type="button"
          className={cn([styles.trigger], {
            [styles.trigger_default]: isDefault,
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
          aria-activedescendant={dropdown.isOpen ? activeOptionId : undefined}
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

export const AbstractField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AbstractFieldProps
>(function AbstractField(props, ref) {
  const generatedId = useId();
  const fieldId = props.id ?? generatedId;
  const hasError = !!props.error;

  const showCharCounter =
    (props.variant === ABSTRACT_FIELD_VARIANT.INPUT ||
      props.variant === ABSTRACT_FIELD_VARIANT.TEXT_AREA) &&
    props.maxLength != null;

  const isControlledWithCounter = showCharCounter && props.value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(0);

  const handleChangeWithCounter = useCallback(
    (value: string) => {
      if (
        props.variant === ABSTRACT_FIELD_VARIANT.INPUT ||
        props.variant === ABSTRACT_FIELD_VARIANT.TEXT_AREA
      ) {
        (
          props as AbstractFieldInputProps | AbstractFieldTextAreaProps
        ).onChange?.(value);
      }
      if (showCharCounter && props.value === undefined) {
        setUncontrolledLength((value ?? '').length);
      }
    },
    [props, showCharCounter],
  );

  const currentLength = showCharCounter
    ? isControlledWithCounter
      ? (props.value ?? '').length
      : uncontrolledLength
    : 0;
  const maxLengthValue = showCharCounter ? props.maxLength! : 0;

  let control: React.ReactNode;

  const needUncontrolledCounter =
    showCharCounter &&
    (props.variant === ABSTRACT_FIELD_VARIANT.INPUT ||
      props.variant === ABSTRACT_FIELD_VARIANT.TEXT_AREA) &&
    props.value === undefined;

  switch (props.variant) {
    case ABSTRACT_FIELD_VARIANT.INPUT:
      control = (
        <InputCore
          {...props}
          {...(needUncontrolledCounter && {
            onChange: handleChangeWithCounter,
          })}
          id={fieldId}
          hasError={hasError}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      );
      break;
    case ABSTRACT_FIELD_VARIANT.TEXT_AREA:
      control = (
        <TextAreaCore
          {...props}
          {...(needUncontrolledCounter && {
            onChange: handleChangeWithCounter,
          })}
          id={fieldId}
          hasError={hasError}
          ref={ref as React.Ref<HTMLTextAreaElement>}
        />
      );
      break;
    case ABSTRACT_FIELD_VARIANT.SELECT:
      control = <SelectCore {...props} hasError={hasError} />;
      break;
    case ABSTRACT_FIELD_VARIANT.INPUT_SELECT:
      control = <InputSelectCore {...props} hasError={hasError} />;
      break;
  }

  const charCounterNode = showCharCounter ? (
    <span className={styles.charCounter} aria-live="polite">
      {currentLength} / {maxLengthValue}
    </span>
  ) : undefined;

  const isDefaultSelectVariant =
    props.variant === ABSTRACT_FIELD_VARIANT.SELECT &&
    (props as AbstractFieldSelectProps).styleVariant === 'default';

  return (
    <FieldLayout
      label={isDefaultSelectVariant ? undefined : props.label}
      error={isDefaultSelectVariant ? undefined : props.error}
      helperText={isDefaultSelectVariant ? undefined : props.helperText}
      required={isDefaultSelectVariant ? undefined : props.required}
      id={fieldId}
      className={props.className}
      charCounter={charCounterNode}
      noFooter={isDefaultSelectVariant}
    >
      {control}
    </FieldLayout>
  );
});
