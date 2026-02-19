import { LoginForm, RegisterForm } from '@/features';
import { useModalTitle } from '@/shared';
import { useCallback, useEffect, useState } from 'react';
import styles from './AuthModal.module.scss';

type AuthMode = 'login' | 'register';

const TITLES: Record<AuthMode, string> = {
  login: 'Войти',
  register: 'Регистрация',
};

interface AuthModalContentProps {
  onClose: () => void;
}

export function AuthModalContent({ onClose }: AuthModalContentProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const setTitle = useModalTitle()?.setTitle;

  useEffect(() => {
    setTitle?.(<h2>{TITLES[mode]}</h2>);
  }, [mode, setTitle]);

  const switchToRegister = useCallback(() => setMode('register'), []);
  const switchToLogin = useCallback(() => setMode('login'), []);

  return (
    <div>
      {mode === 'login' ? (
        <>
          <div className={styles.switch}>
            <p>Нет аккаунта? </p>
            <button type="button" onClick={switchToRegister}>
              Создай новый
            </button>
          </div>
          <LoginForm />
        </>
      ) : (
        <>
          <div className={styles.switch}>
            <p>Есть аккаунт? </p>
            <button type="button" onClick={switchToLogin}>
              Войти
            </button>
          </div>
          <RegisterForm />
        </>
      )}
      <button type="button" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
