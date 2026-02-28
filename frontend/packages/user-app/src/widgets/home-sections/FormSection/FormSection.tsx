import { BookingForm } from '@/features/booking-form';
import type { BookingFormFields } from '@/features/booking-form/ui';
import { getFirstApiErrorMessage } from '@/shared';
import {
  type SubmitBookingRequest,
  useSubmitBookingMutation,
} from '@/shared/api/booking-api';
import { useError, useSuccess } from 'common';
import { type SubmitHandler } from 'react-hook-form';
import styles from './FormSection.module.scss';

const SECTION_TITLE = 'Мы всегда рады помочь';
const SECTION_SUBTITLE = 'Остались вопросы? Свяжитесь с нами через форму ниже';

export function FormSection() {
  const [submitBooking] = useSubmitBookingMutation();
  const addError = useError();
  const addSuccess = useSuccess();

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    const payload: SubmitBookingRequest = {
      first_name: data.first_name.trim(),
      phone: data.phone.trim(),
      messenger: data.messenger.trim(),
      message: data.message.trim(),
    };

    try {
      await submitBooking(payload).unwrap();
      addSuccess('Заявка отправлена');
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err) ?? 'Не удалось отправить заявку';
      console.error(err, 'Failed to submit booking');
      addError(message);
    }
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{SECTION_TITLE}</h2>
      <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
      <BookingForm onSubmit={onSubmit} />
    </section>
  );
}
