import { closeAuthModal, useAppDispatch } from '@/app/redux';
import { useCallback, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import slideStyles from '@/shared/lib/slide-transition.module.scss';
import { RegisterStep1Form } from '../RegisterStep1Form';
import { RegisterStep2Form } from '../RegisterStep2Form';

export function RegisterFlow() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStep1Success = useCallback((step1Email: string, step1Password: string) => {
    setEmail(step1Email);
    setPassword(step1Password);
    setStep(2);
    setIsAnimating(true);
  }, []);

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      setIsAnimating(false);
    },
    [],
  );

  const handleStep2Success = useCallback(() => {
    dispatch(closeAuthModal());
  }, [dispatch]);

  function getSlideClass(slideStep: 1 | 2) {
    if (slideStep === step) {
      return isAnimating ? slideStyles.enterRight : slideStyles.active;
    }
    return isAnimating ? slideStyles.exitLeft : slideStyles.hidden;
  }

  return (
    <div className={slideStyles.slidesContainer}>
      <div
        className={cn([slideStyles.slide, getSlideClass(1)])}
        onAnimationEnd={step === 1 ? handleAnimationEnd : undefined}
      >
        <RegisterStep1Form onSuccess={handleStep1Success} />
      </div>
      <div
        className={cn([slideStyles.slide, getSlideClass(2)])}
        onAnimationEnd={step === 2 ? handleAnimationEnd : undefined}
      >
        <RegisterStep2Form
          email={email}
          password={password}
          onSuccess={handleStep2Success}
        />
      </div>
    </div>
  );
}
