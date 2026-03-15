import { AbstractField } from '@/shared/ui/components/AbstractField';
import { ABSTRACT_FIELD_VARIANT } from '@/shared/ui/components/AbstractField/model/types';
import { forwardRef } from 'react';

export type InputType = 'text' | 'tel' | 'email' | 'password' | 'url';

type BaseInputProps = {
  invalid?: boolean;
  error?: string;
  className?: string;
  type?: InputType;
  placeholder?: string;
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showPasswordToggle?: boolean;
  actionButton?: React.ReactElement;
};

export type InputProps = BaseInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps>;

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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    invalid = false,
    error,
    className,
    type = 'text',
    placeholder,
    label,
    showPasswordToggle,
    actionButton,
    iconLeft,
    iconRight,
    value: valueProp,
    onChange: onChangeProp,
    name,
    onBlur,
    ...rest
  },
  ref,
) {
  const isControlled = valueProp !== undefined;
  const resolvedValue =
    isControlled && valueProp != null
      ? typeof valueProp === 'string'
        ? valueProp
        : String(valueProp)
      : undefined;

  const onChange = (newValue: string) => {
    if (typeof onChangeProp === 'function') {
      const synthetic = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChangeProp(synthetic);
    }
  };

  const resolvedError = error || (invalid ? '\u00A0' : undefined);

  return (
    <AbstractField
      ref={ref as React.Ref<HTMLInputElement>}
      variant={ABSTRACT_FIELD_VARIANT.INPUT}
      label={label}
      error={resolvedError}
      placeholder={placeholder}
      type={type}
      value={resolvedValue}
      onChange={onChange}
      name={name}
      onBlur={onBlur}
      className={className}
      id={rest.id as string | undefined}
      maxLength={rest.maxLength}
      autoComplete={getAutoComplete(type)}
      disabled={rest.disabled}
      iconLeft={iconLeft}
      iconRight={iconRight}
      readOnly={rest.readOnly}
      required={rest.required}
      showPasswordToggle={showPasswordToggle}
      actionButton={actionButton}
    />
  );
});
