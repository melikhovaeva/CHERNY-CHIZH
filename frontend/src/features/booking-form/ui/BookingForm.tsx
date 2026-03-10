import { Button, Form, Input } from '@/shared/ui/components';
import { useError } from '@/shared/ui/components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import formImage from '../assets/form-image.webp';
import type { BookingFormFields } from '../model';
import { BookingFormFieldsEnum } from '../model/enums';
import styles from './BookingForm.module.scss';

type BookingFormMode = 'guest' | 'auth';

interface BookingFormProps {
  onSubmit: SubmitHandler<BookingFormFields>;
  mode?: BookingFormMode;
}

export const BookingForm = ({ onSubmit, mode = 'guest' }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormFields>();
  const addError = useError();

  const isGuest = mode === 'guest';

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, () =>
        addError('Проверьте заполнение полей'),
      )}
    >
      <div className={styles.root}>
        <div className={styles.fieldsContainer}>
          {isGuest && (
            <>
              <Input
                placeholder="Ваше имя"
                type="text"
                invalid={!!errors.first_name}
                {...register(BookingFormFieldsEnum.FIRST_NAME, {
                  required: true,
                })}
              />
              <Input
                type="tel"
                placeholder="Ваш телефон"
                invalid={!!errors.phone}
                {...register(BookingFormFieldsEnum.PHONE, {
                  required: true,
                })}
              />
              <Input
                type="text"
                placeholder="Мессенджер для связи (например, Telegram)"
                invalid={!!errors.messenger}
                {...register(BookingFormFieldsEnum.MESSENGER, {
                  required: true,
                })}
              />
            </>
          )}
          {!isGuest && (
            null
          )}
          <Input
            multiline
            placeholder="Введите ваш вопрос"
            invalid={!!errors.message}
            {...register(BookingFormFieldsEnum.MESSAGE, {
              required: true,
            })}
          />
          <div>
            <Button type="submit" className={styles.submitButton}>
              Отправить
            </Button>
            <p className={styles.consent}>
              Отправляя заявку, вы соглашаетесь на{' '}
              <a href="#">обработку персональных данных</a>
            </p>
          </div>
        </div>
        <div className={styles.formImageWrapper}>
          <img className={styles.formImage} src={formImage} alt="Form" />
        </div>
      </div>
    </Form>
  );
};
