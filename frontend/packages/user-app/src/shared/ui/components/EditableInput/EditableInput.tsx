import { cn } from '@/shared/lib/utils';
import type React from 'react';
import { useState } from 'react';
import { EditSaveButton } from '../EditSaveButton';
import { Input, type InputType } from '../Input';
import styles from './EditableInput.module.scss';

interface EditableInputProps {
  label?: string;
  type?: InputType;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  readOnlyWhenNotEditing?: boolean;
  initialEditing?: boolean;
  saving?: boolean;
  error?: string;
}

export function EditableInput({
  label,
  type = 'text',
  value,
  onChange,
  onSave,
  placeholder,
  readOnlyWhenNotEditing = true,
  initialEditing = false,
  saving,
  error,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (saving || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(value);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const readOnly = readOnlyWhenNotEditing && !isEditing;
  const inputClassName = cn([styles.input], {
    [styles.readonlyInput]: readOnly,
  });

  return (
    <div className={styles.row}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={inputClassName}
        error={error}
        actionButton={
          <EditSaveButton
            className={styles.editSaveButton}
            editing={isEditing}
            onClick={handleClick}
            disabled={saving || isSaving}
            ariaLabelView={`Изменить ${label ?? 'поле'}`}
            ariaLabelEdit={`Сохранить ${label ?? 'поле'}`}
          />
        }
      />
    </div>
  );
}
