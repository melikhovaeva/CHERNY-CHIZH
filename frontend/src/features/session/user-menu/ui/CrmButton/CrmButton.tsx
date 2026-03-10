import { cn } from '@/shared/lib/utils';
import styles from './CrmButton.module.scss';
import DashboardIcon from './assets/dashboard.svg?react';

interface CrmButtonProps {
  className?: string;
  onClick?: () => void;
}

export const CrmButton = ({ className, onClick }: CrmButtonProps) => {
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
