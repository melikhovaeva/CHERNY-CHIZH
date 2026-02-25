import { cn } from '@/shared/lib/utils';
import { forwardRef, useId, useState } from 'react';
import EyeIcon from './assets/eye.svg?react';
import EyeOffIcon from './assets/eye-off.svg?react';
import styles from './Input.module.scss';

export type InputType = 'text' | 'tel' | 'email' | 'password' | 'url';

type BaseInputProps = {
  invalid?: boolean;
  error?: string;
  className?: string;
  multiline?: boolean;
  type?: InputType;
  placeholder?: string;
  label?: string;
  showPasswordToggle?: boolean;
};

type InputProps = BaseInputProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    keyof BaseInputProps
  >;

type TextareaProps = BaseInputProps &
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    keyof BaseInputProps | 'type'
  >;

function getAutoComplete(type: InputType): string | undefined {
  switch (type) {
    case 'email':
      return 'email';
    case 'tel':
      return 'tel';
    case 'password':
      return 'current-password';
    case 'url':
      return 'url';
    default:
      return undefined;
  }
}

function getInputMode(type: InputType): React.HTMLAttributes<HTMLInputElement>['inputMode'] {
  if (type === 'tel') return 'tel';
  return undefined;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps | TextareaProps
>(function Input(
  {
    invalid = false,
    error,
    className,
    multiline = false,
    type = 'text',
    placeholder,
    label,
    showPasswordToggle,
    ...rest
  },
  ref
) {
  const isInvalid = invalid || !!error;
  const generatedId = useId();
  const inputId = (rest as Record<string, unknown>).id as string | undefined ?? generatedId;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const hasToggle = showPasswordToggle ?? isPassword;
  const resolvedType = isPassword && passwordVisible ? 'text' : type;

  const inputClassName = cn(
    [multiline ? styles.textarea : styles.input],
    { [styles.invalid]: isInvalid, [styles.withToggle]: hasToggle }
  );
  const resolvedClassName = className ? `${inputClassName} ${className}` : inputClassName;

  let element: React.ReactNode;

  if (multiline) {
    const textareaRest = rest as Omit<TextareaProps, keyof BaseInputProps>;
    element = (
      <textarea
        id={inputId}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={resolvedClassName}
        placeholder={placeholder}
        {...textareaRest}
      />
    );
  } else {
    const inputRest = rest as Omit<InputProps, keyof BaseInputProps>;
    const inputElement = (
      <input
        id={inputId}
        ref={ref as React.Ref<HTMLInputElement>}
        type={resolvedType}
        className={resolvedClassName}
        placeholder={placeholder}
        autoComplete={getAutoComplete(type)}
        inputMode={getInputMode(type)}
        {...inputRest}
      />
    );

    if (hasToggle) {
      element = (
        <div className={styles.inputWrapper}>
          {inputElement}
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
    } else {
      element = inputElement;
    }
  }

  if (label || error) {
    return (
      <div className={styles.field}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        {element}
        <span
          className={cn([styles.error], { [styles.error_visible]: !!error })}
          role={error ? 'alert' : undefined}
        >
          {error || '\u00A0'}
        </span>
      </div>
    );
  }

  return element;
});
