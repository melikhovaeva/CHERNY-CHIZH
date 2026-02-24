import { BookingForm } from '@/features/booking-form';
import type { BookingFormFields } from '@/features/booking-form/ui';
import {
  type SubmitBookingRequest,
  useSubmitBookingMutation,
} from '@/shared/api/booking-api';
import { type SubmitHandler } from 'react-hook-form';
import styles from './FormSection.module.scss';

const SECTION_TITLE = 'Мы всегда рады помочь';
const SECTION_SUBTITLE = 'Остались вопросы? Свяжитесь с нами через форму ниже';

export function FormSection() {
  const [submitBooking, { isSuccess }] = useSubmitBookingMutation();

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    const payload: SubmitBookingRequest = {
      first_name: data.first_name.trim(),
      phone: data.phone.trim(),
      messenger: data.messenger.trim(),
      message: data.message.trim(),
    };

    await submitBooking(payload).unwrap();
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{SECTION_TITLE}</h2>
      <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
      {isSuccess && (
        <p className={styles.subtitle}>
          Спасибо! Ваша заявка отправлена, мы свяжемся с вами.
        </p>
      )}
      <BookingForm onSubmit={onSubmit} />
    </section>
  );
}
