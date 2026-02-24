import { LoginForm, RegisterFlow } from '@/features';
import { useModalTitle } from '@/shared';
import { cn } from '@/shared/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { AuthMode, TITLES } from '../model';
import styles from './AuthModal.module.scss';

export function AuthModalContent() {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
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
        className={cn([styles.slide, getSlideClass(AuthMode.LOGIN)])}
        onAnimationEnd={
          mode === AuthMode.LOGIN ? handleAnimationEnd : undefined
        }
      >
        <h2>{TITLES[AuthMode.LOGIN]}</h2>
        <div className={styles.switch}>
          <p>Нет аккаунта? </p>
          <button
            type="button"
            onClick={() => switchMode(AuthMode.REGISTER)}
            disabled={isAnimating}
          >
            Создай новый
          </button>
        </div>
        <LoginForm />
      </div>
      <div
        className={cn([styles.slide, getSlideClass(AuthMode.REGISTER)])}
        onAnimationEnd={
          mode === AuthMode.REGISTER ? handleAnimationEnd : undefined
        }
      >
        <h2>{TITLES[AuthMode.REGISTER]}</h2>
        <div className={styles.switch}>
          <p>Есть аккаунт? </p>
          <button
            type="button"
            onClick={() => switchMode(AuthMode.LOGIN)}
            disabled={isAnimating}
          >
            Войти
          </button>
        </div>
        <RegisterFlow />
      </div>
    </div>
  );
}
