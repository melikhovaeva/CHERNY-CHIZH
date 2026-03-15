import { AbstractField } from '@/shared/ui/components/AbstractField';
import { ABSTRACT_FIELD_VARIANT } from '@/shared/ui/components/AbstractField/model/types';
import { forwardRef } from 'react';

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange'
> & {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      error,
      helperText,
      placeholder,
      value: valueProp,
      onChange: onChangeProp,
      name,
      onBlur,
      rows,
      maxLength,
      disabled,
      readOnly,
      required,
      className,
      id,
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : undefined;

    const onChange = (newValue: string) => {
      if (onChangeProp) {
        const synthetic = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChangeProp(synthetic);
      }
    };

    return (
      <AbstractField
        ref={ref}
        variant={ABSTRACT_FIELD_VARIANT.TEXT_AREA}
        label={label}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={className}
        id={id}
      />
    );
  },
);
