import { useRegisterStep2Mutation } from '@/entities/session';
import { Button, Form, Input } from '@/shared/ui/components';
import { useForm } from 'react-hook-form';
import { getFirstApiErrorMessage } from '@/shared';
import styles from '../register-form-layout.module.scss';

const STEP2_ERROR_FIELDS = ['first_name', 'last_name', 'email', 'detail'] as const;

export interface RegisterStep2FormFields {
  first_name: string;
  last_name?: string;
  phone: string;
  telegram: string;
}

interface RegisterStep2FormProps {
  email: string;
  password: string;
  onSuccess?: () => void;
}

export const RegisterStep2Form = ({
  email,
  password,
  onSuccess,
}: RegisterStep2FormProps) => {
  const [registerStep2, { isLoading, error }] = useRegisterStep2Mutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep2FormFields>({
    defaultValues: { phone: '', telegram: '' },
  });

  const onSubmit = async (data: RegisterStep2FormFields) => {
    try {
      await registerStep2({
        email,
        password,
        password2: password,
        first_name: data.first_name,
        last_name: data.last_name?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        telegram: data.telegram?.trim() || undefined,
      }).unwrap();
      onSuccess?.();
    } catch {
      // Error shown via apiError
    }
  };

  const apiError = getFirstApiErrorMessage(error, [...STEP2_ERROR_FIELDS]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.root}>
        <div className={styles.fields}>
          <Input
            label="Имя"
            placeholder="Введите имя"
            error={errors.first_name?.message}
            {...register('first_name', {
              required: 'Введите имя',
            })}
          />
          <Input
            label="Фамилия"
            placeholder="Необязательно"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
          <Input
            label="Телефон"
            placeholder="Необязательно"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Телеграм"
            placeholder="Необязательно"
            error={errors.telegram?.message}
            {...register('telegram')}
          />
          <div className={styles.apiErrorSlot}>
            {apiError && <p className={styles.apiError}>{apiError}</p>}
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          Завершить регистрацию
        </Button>
      </div>
    </Form>
  );
};
