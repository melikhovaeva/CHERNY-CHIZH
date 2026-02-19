import {
  BookingForm,
  type BookingFormFields,
} from '@/features/booking-form/ui';
import { useSubmitBookingMutation } from '@/shared/api/booking-api';
import { type SubmitHandler } from 'react-hook-form';

interface BookingModalContentProps {
  onSuccess: () => void;
}

export function BookingModalContent({ onSuccess }: BookingModalContentProps) {
  const [submitBooking] = useSubmitBookingMutation();

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    try {
      await submitBooking(data).unwrap();
      onSuccess();
      console.log('success', data);
    } catch (error) {
      console.error(error);
    }
  };

  return <BookingForm onSubmit={onSubmit} />;
}
