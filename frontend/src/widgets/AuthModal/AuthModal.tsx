import { LoginForm, RegisterForm } from '@/features';
import { useModalTitle } from '@/shared';
import { useCallback, useEffect, useState } from 'react';

type AuthMode = 'login' | 'register';

const TITLES: Record<AuthMode, string> = {
  login: 'Вход',
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
          <LoginForm />
          <p>
            Нет аккаунта?{' '}
            <button type="button" onClick={switchToRegister}>
              Зарегистрироваться
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm />
          <p>
            Уже есть аккаунт?{' '}
            <button type="button" onClick={switchToLogin}>
              Войти
            </button>
          </p>
        </>
      )}
      <button type="button" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
