import { useAppDispatch } from '@/app/store';
import { formFields } from '@/entities/course/ui/CourseCreateEditForm/model/config';
import { useLoginMutation } from '@/entities/session';
import { closeAuthModal } from '@/features/auth-modal';
import { getFirstApiErrorMessage } from '@/shared';
import {
  Button,
  Form,
  Input,
  useError,
  useSuccess,
} from '@/shared/ui/components';
import { Controller, useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';

interface LoginFormFields {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const addError = useError();
  const addSuccess = useSuccess();

  const { handleSubmit, control } = useForm<LoginFormFields>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
          <Controller
            control={control}
            name={formFields.email.name}
            rules={formFields.email.validation}
            render={({ field, fieldState }) => (
              <Input
                label={formFields.email.label}
                placeholder={formFields.email.placeholder}
                type="email"
                error={fieldState.error?.message}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          <div>
            <Controller
              control={control}
              name={formFields.password.name}
              rules={formFields.password.validation}
              render={({ field, fieldState }) => (
                <Input
                  label={formFields.password.label}
                  placeholder={formFields.password.placeholder}
                  type="password"
                  error={fieldState.error?.message}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
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
