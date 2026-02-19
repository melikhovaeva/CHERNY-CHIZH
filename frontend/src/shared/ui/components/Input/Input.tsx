import { cn } from '@/shared/lib/utils';
import { forwardRef } from 'react';
import styles from './Input.module.scss';

export type InputType = 'text' | 'tel' | 'email' | 'password' | 'url';

type BaseInputProps = {
  invalid?: boolean;
  className?: string;
  multiline?: boolean;
  type?: InputType;
  placeholder?: string;
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
    className,
    multiline = false,
    type = 'text',
    placeholder,
    ...rest
  },
  ref
) {
  const inputClassName = cn(
    [multiline ? styles.textarea : styles.input],
    { [styles.invalid]: invalid }
  );
  const resolvedClassName = className ? `${inputClassName} ${className}` : inputClassName;

  if (multiline) {
    const textareaRest = rest as Omit<TextareaProps, keyof BaseInputProps>;
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={resolvedClassName}
        placeholder={placeholder}
        {...textareaRest}
      />
    );
  }

  const inputRest = rest as Omit<InputProps, keyof BaseInputProps>;
  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      className={resolvedClassName}
      placeholder={placeholder}
      autoComplete={getAutoComplete(type)}
      inputMode={getInputMode(type)}
      {...inputRest}
    />
  );
});
