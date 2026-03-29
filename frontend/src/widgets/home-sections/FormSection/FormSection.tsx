import { BookingForm } from '@/features/booking-form';
import type { BookingFormFields } from '@/features/booking-form/ui';
import { getFirstApiErrorMessage } from '@/shared';
import {
  type SubmitBookingRequest,
  useSubmitBookingMutation,
} from '@/entities/booking';
import { useAuth } from '@/entities/session';
import { useError, useSuccess } from '@/shared/ui/components';
import { type SubmitHandler } from 'react-hook-form';
import styles from './FormSection.module.scss';

const SECTION_TITLE = 'Мы всегда рады помочь';
const SECTION_SUBTITLE = 'Остались вопросы? Свяжитесь с нами через форму ниже';

export function FormSection() {
  const [submitBooking] = useSubmitBookingMutation();
  const addError = useError();
  const addSuccess = useSuccess();
  const { user, isAuthenticated } = useAuth();

  const prefilledData =
    isAuthenticated && user
      ? {
          firstName: user.firstName,
          phone: user.phone ?? undefined,
          messenger: user.messenger ?? undefined,
        }
      : undefined;

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    const payload: SubmitBookingRequest = {
      firstName: (prefilledData?.firstName ?? data.firstName ?? '').trim(),
      phone: (prefilledData?.phone ?? data.phone ?? '').trim(),
      messenger: (prefilledData?.messenger ?? data.messenger ?? '').trim(),
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
      throw err;
    }
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{SECTION_TITLE}</h2>
      <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
      <BookingForm onSubmit={onSubmit} prefilledData={prefilledData} />
    </section>
  );
}
