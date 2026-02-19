import { Button, Checkbox, Form, Input } from '@/shared/ui/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.scss';

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
    formState: { isValid },
  } = useForm<RegisterFormFields>({ mode: 'onChange' });

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
            {...register('email', { required: true })}
          />
          <Input
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            {...register('password', { required: true })}
          />
          <Input
            label="Повторите пароль"
            placeholder="Повторите пароль"
            type="password"
            {...register('confirmPassword', { required: true })}
          />
        </div>
        <Button type="submit" disabled={!isValid || !agreed}>
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
