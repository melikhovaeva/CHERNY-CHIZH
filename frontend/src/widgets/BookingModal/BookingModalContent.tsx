import {
  BookingForm,
  type BookingFormFields,
} from '@/features/booking-form/ui';
import {
  type SubmitBookingRequest,
  useSubmitBookingMutation,
} from '@/shared/api/booking-api';
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

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    try {
      const payload: SubmitBookingRequest = {
        first_name: data.first_name.trim(),
        phone: data.phone.trim(),
        messenger: data.messenger.trim(),
        message: data.message.trim(),
        dog: dogId ?? undefined,
      };

      await submitBooking(payload).unwrap();
      onSuccess();
      console.log('success', data);
    } catch (error) {
      console.error(error);
    }
  };

  return <BookingForm onSubmit={onSubmit} />;
}
