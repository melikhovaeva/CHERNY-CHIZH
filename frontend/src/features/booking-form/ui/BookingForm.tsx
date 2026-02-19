import { cn } from '@/shared/lib/utils';
import { Button, Form } from '@/shared/ui/components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import formImage from '../assets/form-image.webp';
import type { BookingFormFields } from '../model';
import { BookingFormFieldsEnum } from '../model/enums';
import styles from './BookingForm.module.scss';

interface BookingFormProps {
  onSubmit: SubmitHandler<BookingFormFields>;
}

export const BookingForm = ({ onSubmit }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormFields>();
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.root}>
        <div className={styles.fieldsContainer}>
          <input
            className={cn([styles.input], {
              [styles.invalid]: !!errors.name,
            })}
            placeholder="Ваше имя"
            type="text"
            {...register(BookingFormFieldsEnum.NAME, {
              required: true,
            })}
          />
          <input
            className={cn([styles.input], {
              [styles.invalid]: !!errors.phone,
            })}
            type="tel"
            placeholder="Ваш телефон"
            {...register(BookingFormFieldsEnum.PHONE, {
              required: true,
            })}
          />
          <input
            className={cn([styles.input], {
              [styles.invalid]: !!errors.telegram,
            })}
            type="text"
            placeholder="Ваш Telegram ID"
            {...register(BookingFormFieldsEnum.TELEGRAM, {
              required: true,
            })}
          />
          <textarea
            className={cn([styles.textarea], {
              [styles.invalid]: !!errors.message,
            })}
            placeholder="Введите ваш вопрос"
            {...register(BookingFormFieldsEnum.MESSAGE, {
              required: true,
            })}
          />
        </div>
        <div>
          <Button type="submit" className={styles.submitButton}>
            Отправить
          </Button>
          <p className={styles.consent}>
            Отправляя заявку, вы соглашаетесь на{' '}
            <a href="#">обработку персональных данных</a>
          </p>
        </div>
        <div className={styles.formImageWrapper}>
          <img className={styles.formImage} src={formImage} alt="Form" />
        </div>
      </div>
    </Form>
  );
};
