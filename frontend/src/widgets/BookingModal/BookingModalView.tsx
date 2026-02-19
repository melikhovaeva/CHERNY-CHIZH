import {
  closeBookingModal,
  selectBookingModalIsOpen,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux';
import { BookingFields } from '@/features/booking-fields';
import { useSubmitBookingMutation } from '@/shared/api/booking-api';
import { Form } from '@/shared/ui/components';
import { BookingModal } from './BookingModal';

export function BookingModalView() {
  const isOpen = useAppSelector(selectBookingModalIsOpen);
  const dispatch = useAppDispatch();
  const [submitBooking] = useSubmitBookingMutation();

  const handleClose = () => {
    dispatch(closeBookingModal());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitBooking({
        name: '',
        phone: '',
      }).unwrap();
      dispatch(closeBookingModal());
    } catch {
      // TODO: handle error
    }
  };

  return (
    <BookingModal isOpen={isOpen} onClose={handleClose}>
      <Form onSubmit={handleSubmit}>
        <BookingFields />
      </Form>
    </BookingModal>
  );
}
