import { Button, Checkbox, Form, Input } from '@/shared/ui/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.scss';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;

interface RegisterFormFields {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm = () => {
  const [agreed, setAgreed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormFields>();

  const onSubmit = (data: RegisterFormFields) => {
    console.log(data);
  };

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
        </div>
        <Button type="submit" disabled={!agreed}>
          Создать аккаунт
        </Button>
        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label={
            <span className={styles.consent}>
              Нажимая «Создать аккаунт», я подтверждаю, что ознакомился(лась) и
              принимаю <a href="#">Условия использования</a> и{' '}
              <a href="#">Политику конфиденциальности</a>
            </span>
          }
        />
      </div>
    </Form>
  );
};
