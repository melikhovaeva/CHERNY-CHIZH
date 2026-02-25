import { cn } from '@/shared/lib/utils';
import ProfileIcon from './assets/profile.svg?react';
import styles from './ProfileButton.module.scss';

interface ProfileButtonProps {
  className?: string;
  onClick?: () => void;
}

export const ProfileButton = ({ className, onClick }: ProfileButtonProps) => {
  return (
    <button
      type="button"
      className={cn([styles.button, className || ''])}
      onClick={onClick}
    >
      <ProfileIcon width={16} height={16} />
      Профиль
    </button>
  );
};

