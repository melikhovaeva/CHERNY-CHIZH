import { LoginForm, RegisterForm } from '@/features';
import { useModalTitle } from '@/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './AuthModal.module.scss';

type AuthMode = 'login' | 'register';

const TITLES: Record<AuthMode, string> = {
  login: 'Войти',
  register: 'Регистрация',
};

interface AuthModalContentProps {
  onClose: () => void;
}

function renderContent(
  m: AuthMode,
  onSwitchToRegister: () => void,
  onSwitchToLogin: () => void,
  onClose: () => void,
) {
  return (
    <>
      {m === 'login' ? (
        <>
          <div className={styles.switch}>
            <p>Нет аккаунта? </p>
            <button type="button" onClick={onSwitchToRegister}>
              Создай новый
            </button>
          </div>
          <LoginForm />
        </>
      ) : (
        <>
          <div className={styles.switch}>
            <p>Есть аккаунт? </p>
            <button type="button" onClick={onSwitchToLogin}>
              Войти
            </button>
          </div>
          <RegisterForm />
        </>
      )}
      <button type="button" onClick={onClose}>
        Закрыть
      </button>
    </>
  );
}

export function AuthModalContent({ onClose }: AuthModalContentProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMode, setPreviousMode] = useState<AuthMode>('login');
  const [nextMode, setNextMode] = useState<AuthMode>('login');
  const [animating, setAnimating] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  const setTitle = useModalTitle()?.setTitle;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTransitioning) {
      setTitle?.(<h2>{TITLES[mode]}</h2>);
    }
  }, [mode, setTitle, isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) return;

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(true);
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [isTransitioning]);

  const switchToRegister = useCallback(() => {
    setWrapperHeight(wrapperRef.current?.offsetHeight ?? null);
    setPreviousMode('login');
    setNextMode('register');
    setIsTransitioning(true);
  }, []);
  const switchToLogin = useCallback(() => {
    setWrapperHeight(wrapperRef.current?.offsetHeight ?? null);
    setPreviousMode('register');
    setNextMode('login');
    setIsTransitioning(true);
  }, []);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName !== 'transform') return;
      if (!isTransitioning) return;

      setMode(nextMode);
      setIsTransitioning(false);
      setAnimating(false);
      setWrapperHeight(null);
    },
    [isTransitioning, nextMode],
  );

  return (
    <div
      ref={wrapperRef}
      className={cn([styles.sliderWrapper], { [styles.animating]: animating })}
      style={wrapperHeight != null ? { height: wrapperHeight } : undefined}
      onTransitionEnd={handleTransitionEnd}
    >
      {isTransitioning ? (
        <>
          <div className={cn([styles.slide, styles.slideExit])} aria-hidden>
            {renderContent(previousMode, switchToRegister, switchToLogin, onClose)}
          </div>
          <div className={cn([styles.slide, styles.slideEnter])}>
            {renderContent(nextMode, switchToRegister, switchToLogin, onClose)}
          </div>
        </>
      ) : (
        <div className={styles.slide}>
          {renderContent(mode, switchToRegister, switchToLogin, onClose)}
        </div>
      )}
    </div>
  );
}
