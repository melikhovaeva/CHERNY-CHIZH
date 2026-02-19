import { LoginForm, RegisterForm } from '@/features';
import { cn } from '@/shared/lib/utils';
import { useModalTitle } from '@/shared';
import { useCallback, useEffect, useState } from 'react';
import styles from './AuthModal.module.scss';

type AuthMode = 'login' | 'register';

const TITLES: Record<AuthMode, string> = {
  login: 'Войти',
  register: 'Регистрация',
};

export function AuthModalContent() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const setTitle = useModalTitle()?.setTitle;

  useEffect(() => {
    setTitle?.(null);
  }, [setTitle]);

  const switchMode = useCallback(
    (newMode: AuthMode) => {
      if (isAnimating || newMode === mode) return;
      setMode(newMode);
      setIsAnimating(true);
    },
    [isAnimating, mode],
  );

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      setIsAnimating(false);
    },
    [],
  );

  function getSlideClass(slideMode: AuthMode) {
    if (slideMode === mode) {
      return isAnimating ? styles.enterRight : styles.active;
    }
    return isAnimating ? styles.exitLeft : styles.hidden;
  }

  return (
    <div className={styles.slidesContainer}>
      <div
        className={cn([styles.slide, getSlideClass('login')])}
        onAnimationEnd={mode === 'login' ? handleAnimationEnd : undefined}
      >
        <h2>{TITLES.login}</h2>
        <div className={styles.switch}>
          <p>Нет аккаунта? </p>
          <button
            type="button"
            onClick={() => switchMode('register')}
            disabled={isAnimating}
          >
            Создай новый
          </button>
        </div>
        <LoginForm />
      </div>
      <div
        className={cn([styles.slide, getSlideClass('register')])}
        onAnimationEnd={mode === 'register' ? handleAnimationEnd : undefined}
      >
        <h2>{TITLES.register}</h2>
        <div className={styles.switch}>
          <p>Есть аккаунт? </p>
          <button
            type="button"
            onClick={() => switchMode('login')}
            disabled={isAnimating}
          >
            Войти
          </button>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
