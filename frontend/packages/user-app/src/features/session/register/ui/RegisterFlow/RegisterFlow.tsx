import slideStyles from '@/shared/lib/slide-transition.module.scss';
import { cn } from '@/shared/lib/utils';
import { useCallback, useState } from 'react';
import { useRegisterFlow } from '../../model/useRegisterFlow';
import { RegisterStep1Form } from '../RegisterStep1Form';
import { RegisterStep2Form } from '../RegisterStep2Form';

export function RegisterFlow() {
  const { step, email, password, handleStep1Success, handleStep2Success } =
    useRegisterFlow();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStep1SuccessUi = useCallback(
    (step1Email: string, step1Password: string) => {
      handleStep1Success(step1Email, step1Password);
      setIsAnimating(true);
    },
    [handleStep1Success],
  );

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      setIsAnimating(false);
    },
    [],
  );

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
        <RegisterStep1Form onSuccess={handleStep1SuccessUi} />
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
