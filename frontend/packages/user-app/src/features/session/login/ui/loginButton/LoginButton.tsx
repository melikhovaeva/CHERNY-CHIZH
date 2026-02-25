import { openAuthModal, useAppDispatch } from '@/app/redux';
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
