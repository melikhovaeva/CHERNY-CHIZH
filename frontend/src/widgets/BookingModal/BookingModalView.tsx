import {
  closeBookingModal,
  selectBookingModalIsOpen,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux';
import {
  BookingForm,
  type BookingFormFields,
} from '@/features/booking-form/ui';
import { useSubmitBookingMutation } from '@/shared/api/booking-api';
import { Modal } from '@/shared/ui/components';
import { type SubmitHandler } from 'react-hook-form';

export function BookingModalView() {
  const dispatch = useAppDispatch();

  // MODAL
  const isOpen = useAppSelector(selectBookingModalIsOpen);
  const handleClose = () => {
    dispatch(closeBookingModal());
  };

  // FORM SUBMIT
  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    try {
      await submitBooking(data).unwrap();
      dispatch(closeBookingModal());
      console.log('success', data);
    } catch (error) {
      console.error(error);
    }
  };

  const [submitBooking] = useSubmitBookingMutation();
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={<h2>ЗАБРОНИРОВАТЬ</h2>}>
      <BookingForm onSubmit={onSubmit} />
    </Modal>
  );
}
