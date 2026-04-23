import { useAppDispatch } from '@/app/store';
import { openAuthModal } from '@/features/auth-modal';
import styles from './LoginButton.module.scss';

import Login from './assets/login.svg?react';

export function LoginButton() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(openAuthModal());
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      <Login />
      <span>Войти</span>
    </button>
  );
}
