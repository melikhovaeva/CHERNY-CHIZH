import { closeAuthModal } from '@/features/auth-modal';
import { useAppDispatch } from '@/app/store';
import { useLoginMutation } from '@/entities/session';
import { getFirstApiErrorMessage } from '@/shared';
import { Button, Form, Input } from '@/shared/ui/components';
import { useError, useSuccess } from '@/shared/common';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface LoginFormFields {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const addError = useError();
  const addSuccess = useSuccess();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>();

  const onSubmit = async (data: LoginFormFields) => {
    try {
      await login({ tokenObtainPair: data }).unwrap();
      addSuccess('Вход выполнен');
      dispatch(closeAuthModal());
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err, ['detail', 'email', 'password']) ??
        'Не удалось войти';
      console.error(err, 'Failed to login');
      addError(message);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, () =>
        addError('Проверьте заполнение полей'),
      )}
    >
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
        <Button type="submit" disabled={isLoading}>
          Войти
        </Button>
      </div>
    </Form>
  );
};
