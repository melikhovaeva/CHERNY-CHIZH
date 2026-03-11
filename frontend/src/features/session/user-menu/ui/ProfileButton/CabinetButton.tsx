import { cn } from '@/shared/lib/utils';
import ProfileIcon from './assets/profile.svg?react';
import styles from './CabinetButton.module.scss';

interface CabinetButtonProps {
  className?: string;
  onClick?: () => void;
}

export const CabinetButton = ({ className, onClick }: CabinetButtonProps) => {
  return (
    <button
      type="button"
      className={cn([styles.button, className || ''])}
      onClick={onClick}
    >
      <ProfileIcon width={16} height={16} />
      Личный кабинет
    </button>
  );
};

