import { useRegisterStep1Mutation } from '@/entities/session';
import { getFirstApiErrorMessage } from '@/shared';
import { Button, Checkbox, Form, Input } from '@/shared/ui/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../register-form-layout.module.scss';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;

const STEP1_ERROR_FIELDS = [
  'email',
  'password',
  'password2',
  'detail',
] as const;

export interface RegisterStep1FormFields {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterStep1FormProps {
  onSuccess: (email: string, password: string) => void;
}

export const RegisterStep1Form = ({ onSuccess }: RegisterStep1FormProps) => {
  const [agreed, setAgreed] = useState(false);
  const [registerStep1, { isLoading, error }] = useRegisterStep1Mutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterStep1FormFields>();

  const onSubmit = async (data: RegisterStep1FormFields) => {
    try {
      const result = await registerStep1({
        email: data.email,
        password: data.password,
        password2: data.confirmPassword,
      }).unwrap();
      onSuccess(result.email, data.password);
    } catch {
      console.error(error);
    }
  };

  const apiError = getFirstApiErrorMessage(error, [...STEP1_ERROR_FIELDS]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.root}>
        <div className={styles.fields}>
          <Input
            label="Почта"
            placeholder="Введите почту"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Введите почту',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Некорректный адрес почты',
              },
            })}
          />
          <Input
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: `Минимум ${MIN_PASSWORD_LENGTH} символов`,
              },
            })}
          />
          <Input
            label="Повторите пароль"
            placeholder="Повторите пароль"
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Повторите пароль',
              validate: (value) =>
                value === watch('password') || 'Пароли не совпадают',
            })}
          />
          <div className={styles.apiErrorSlot}>
            {apiError && <p className={styles.apiError}>{apiError}</p>}
          </div>
        </div>
        <Button type="submit" disabled={!agreed || isLoading}>
          Зарегестрироваться
        </Button>
        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label={
            <span className={styles.consent}>
              Нажимая «Зарегестрироваться», я подтверждаю, что ознакомился(лась)
              и принимаю <a href="#">Условия использования</a> и{' '}
              <a href="#">Политику конфиденциальности</a>
            </span>
          }
        />
      </div>
    </Form>
  );
};
