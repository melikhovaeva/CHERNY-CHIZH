import { closeAuthModal } from '@/features/auth-modal';
import { useAppDispatch } from '@/shared/lib/store';
import { useCallback, useState } from 'react';

type RegisterStep = 1 | 2;

interface UseRegisterFlowResult {
  step: RegisterStep;
  email: string;
  password: string;
  handleStep1Success: (email: string, password: string) => void;
  handleStep2Success: () => void;
}

export function useRegisterFlow(): UseRegisterFlowResult {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<RegisterStep>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStep1Success = useCallback((step1Email: string, step1Password: string) => {
    setEmail(step1Email);
    setPassword(step1Password);
    setStep(2);
  }, []);

  const handleStep2Success = useCallback(() => {
    dispatch(closeAuthModal());
  }, [dispatch]);

  return {
    step,
    email,
    password,
    handleStep1Success,
    handleStep2Success,
  };
}

