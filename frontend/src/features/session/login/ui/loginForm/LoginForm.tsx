import { Button, Form, Input } from '@/shared/ui/components';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';

interface LoginFormFields {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormFields>({ mode: 'onChange' });

  const onSubmit = (data: LoginFormFields) => {
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
          <div>
            <Input
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              {...register('password', { required: true })}
            />
            <a href="#" className={styles.forgotPassword}>
              Забыли пароль?
            </a>
          </div>
        </div>
        <Button type="submit" disabled={!isValid}>
          Войти
        </Button>
      </div>
    </Form>
  );
};
