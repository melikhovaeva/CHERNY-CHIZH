import { useLogoutMutation } from '@/entities/session';
import { cn } from '@/shared/lib/utils';
import { useError } from 'common';
import { useCallback } from 'react';
import styles from './LogoutButton.module.scss';
import LogoutIcon from './assets/logout.svg?react';

export const LogoutButton = ({ className }: { className?: string } = {}) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const addError = useError();

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error(error, 'Failed to logout');
      addError('Не удалось выйти');
    }
  }, [logout, addError]);
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
