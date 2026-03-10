import { openAuthModal } from '@/features/auth-modal';
import { useAppDispatch } from '@/app/store';
import styles from './LoginButton.module.scss';
import ArrowLeftIcon from './assets/arrow-left.svg?react';

export function LoginButton() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(openAuthModal());
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      <ArrowLeftIcon />
      <span>Войти</span>
    </button>
  );
}
