import { cn } from '@/shared/lib/utils';
import styles from './AdminButton.module.scss';

interface AdminButtonProps {
  className?: string;
  onClick?: () => void;
}

export const AdminButton = ({ className, onClick }: AdminButtonProps) => {
  return (
    <button
      type="button"
      className={cn([styles.button, className || ''])}
      onClick={onClick}
    >
      Админка
    </button>
  );
};

