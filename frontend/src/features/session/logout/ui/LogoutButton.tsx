import { useLogoutMutation } from '@/entities/session';
import { useCallback } from 'react';
import styles from './LogoutButton.module.scss';

export const LogoutButton = () => {
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
      className={styles.button}
      onClick={handleLogout}
      disabled={isLoading}
    >
      Выйти
    </button>
  );
};
