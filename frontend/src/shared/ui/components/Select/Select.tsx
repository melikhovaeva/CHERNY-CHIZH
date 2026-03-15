import { AbstractField } from '@/shared/ui/components/AbstractField';
import { ABSTRACT_FIELD_VARIANT } from '@/shared/ui/components/AbstractField/model/types';
import type { SelectOption as AbstractFieldSelectOption } from '@/shared/ui/components/AbstractField/model/types';
import { useState } from 'react';

export type SelectOption = AbstractFieldSelectOption;

export interface SelectProps {
  label: string;
  options: SelectOption[];
  variant?: 'default' | 'input';
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Select = ({
  label,
  options,
  value: valueProp,
  onChange,
  className,
  placeholder,
  error,
  disabled,
  required,
}: SelectProps) => {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState('');

  const value = isControlled ? valueProp : internalValue;
  const handleChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <AbstractField
      variant={ABSTRACT_FIELD_VARIANT.SELECT}
      label={label}
      options={options}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      className={className}
      disabled={disabled}
      required={required}
    />
  );
};
