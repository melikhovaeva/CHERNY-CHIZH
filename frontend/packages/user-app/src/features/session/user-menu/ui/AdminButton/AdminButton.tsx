import { cn } from '@/shared/lib/utils';
import styles from './AdminButton.module.scss';
import DashboardIcon from './assets/dashboard.svg?react';

interface AdminButtonProps {
  className?: string;
  onClick?: () => void;
}

export const AdminButton = ({ className, onClick }: AdminButtonProps) => {
  return (
    <>
      <button
        type="button"
        className={cn([styles.button, className || ''])}
        onClick={onClick}
      >
        <DashboardIcon width={16} height={16} />
        Админка
      </button>
    </>
  );
};
