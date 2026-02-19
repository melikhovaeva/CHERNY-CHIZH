import { Button, Form, Input } from '@/shared/ui/components';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface LoginFormFields {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>();

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
            error={errors.email?.message}
            {...register('email', {
              required: 'Введите почту',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Некорректный адрес почты',
              },
            })}
          />
          <div>
            <Input
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Введите пароль',
              })}
            />
            <a href="#" className={styles.forgotPassword}>
              Забыли пароль?
            </a>
          </div>
        </div>
        <Button type="submit">
          Войти
        </Button>
      </div>
    </Form>
  );
};
