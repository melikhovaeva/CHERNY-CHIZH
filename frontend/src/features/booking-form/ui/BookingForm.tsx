import { Button, Form, Input } from '@/shared/ui/components';
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
          <Input
            placeholder="Ваше имя"
            type="text"
            invalid={!!errors.name}
            {...register(BookingFormFieldsEnum.NAME, {
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
            placeholder="Ваш Telegram ID"
            invalid={!!errors.telegram}
            {...register(BookingFormFieldsEnum.TELEGRAM, {
              required: true,
            })}
          />
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
