import { Modal } from '@/shared/ui/components';
import { Button } from '@/shared/ui/components/Button/Button';
import styles from './ChoiceDialog.module.scss';

export type ChoiceDialogOptionVariant = 'primary' | 'secondary' | 'crm' | 'destructive';

export interface ChoiceDialogOption {
  id: string;
  label: string;
  variant?: ChoiceDialogOptionVariant;
  onClick: () => void;
}

interface ChoiceDialogProps {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  options: ChoiceDialogOption[];
  onClose: () => void;
}

export const ChoiceDialog = ({
  isOpen,
  title,
  description,
  options,
  onClose,
}: ChoiceDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.root}>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.actions}>
          {options.map((option) => (
            <Button
              key={option.id}
              variant={option.variant}
              className={styles.actionButton}
              onClick={option.onClick}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

