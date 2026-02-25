import { useLogoutMutation } from '@/entities/session';
import { cn } from '@/shared/lib/utils';
import { useCallback } from 'react';
import styles from './LogoutButton.module.scss';
import LogoutIcon from './assets/logout.svg?react';

export const LogoutButton = ({ className }: { className?: string } = {}) => {
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
    } catch {
      console.error('Failed to logout');
    }
  }, [logout]);
  return (
    <button
      type="button"
      className={cn([styles.button, className || ''])}
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogoutIcon width={16} height={16} />
      Выйти
    </button>
  );
};
