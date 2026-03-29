import {
  BookingForm,
  type BookingFormFields,
} from '@/features/booking-form/ui';
import {
  type SubmitBookingRequest,
  useSubmitBookingMutation,
} from '@/entities/booking';
import { getFirstApiErrorMessage } from '@/shared';
import { useError, useSuccess } from '@/shared/ui/components';
import { type SubmitHandler } from 'react-hook-form';

interface BookingModalContentProps {
  dogId?: number | null;
  onSuccess: () => void;
}

export function BookingModalContent({
  dogId,
  onSuccess,
}: BookingModalContentProps) {
  const [submitBooking] = useSubmitBookingMutation();
  const addError = useError();
  const addSuccess = useSuccess();

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    try {
      const payload: SubmitBookingRequest = {
        firstName: (data.firstName ?? '').trim(),
        phone: (data.phone ?? '').trim(),
        messenger: (data.messenger ?? '').trim(),
        message: data.message.trim(),
        dog: dogId ?? undefined,
      };

      await submitBooking(payload).unwrap();
      addSuccess('Заявка отправлена');
      onSuccess();
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err) ?? 'Не удалось отправить заявку';
      addError(message);
      throw err;
    }
  };

  return <BookingForm onSubmit={onSubmit} />;
}
