export const ABSTRACT_FIELD_VARIANT = {
  INPUT: 'input',
  TEXT_AREA: 'text-area',
  SELECT: 'select',
  INPUT_SELECT: 'input-select',
} as const;

export type AbstractFieldVariant =
  (typeof ABSTRACT_FIELD_VARIANT)[keyof typeof ABSTRACT_FIELD_VARIANT];

export interface SelectOption {
  value: string;
  label: string;
}

interface AbstractFieldBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  id?: string;
}

export interface AbstractFieldInputProps extends AbstractFieldBaseProps {
  variant: typeof ABSTRACT_FIELD_VARIANT.INPUT;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'email' | 'url';
  maxLength?: number;
  autoComplete?: string;
}

export interface AbstractFieldTextAreaProps extends AbstractFieldBaseProps {
  variant: typeof ABSTRACT_FIELD_VARIANT.TEXT_AREA;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export interface AbstractFieldSelectProps extends AbstractFieldBaseProps {
  variant: typeof ABSTRACT_FIELD_VARIANT.SELECT;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export interface AbstractFieldInputSelectProps extends AbstractFieldBaseProps {
  variant: typeof ABSTRACT_FIELD_VARIANT.INPUT_SELECT;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export type AbstractFieldProps =
  | AbstractFieldInputProps
  | AbstractFieldTextAreaProps
  | AbstractFieldSelectProps
  | AbstractFieldInputSelectProps;
