import { openAuthModal, useAppDispatch } from '@/app/redux';
import styles from './LoginButton.module.scss';

export function LoginButton() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(openAuthModal());
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      <i />
      <span>Войти</span>
    </button>
  );
}
