import { cn } from '@/shared/lib/utils';
import { EditIcon, SaveIcon } from '@/shared/ui/assets';
import styles from './EditSaveButton.module.scss';

interface EditSaveButtonProps {
  editing: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabelView?: string;
  ariaLabelEdit?: string;
}

export function EditSaveButton({
  editing,
  onClick,
  disabled,
  className,
  ariaLabelView = 'Изменить',
  ariaLabelEdit = 'Сохранить',
}: EditSaveButtonProps) {
  const label = editing ? ariaLabelEdit : ariaLabelView;

  return (
    <button
      type="button"
      className={cn([styles.button, className || ''], {
        [styles.editing]: editing,
      })}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {editing ? <SaveIcon aria-hidden /> : <EditIcon aria-hidden />}
    </button>
  );
}
