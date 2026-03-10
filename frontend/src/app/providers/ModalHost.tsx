import {
  selectBookingModalDogId,
  selectBookingModalIsOpen,
  closeBookingModal,
} from '@/features/booking-modal';
import {
  closeAuthModal,
  selectAuthModalIsOpen,
} from '@/features/auth-modal';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { Modal } from '@/shared/ui/components';
import { AuthModalContent, BookingModalContent } from '@/widgets';

export function ModalHost() {
  const dispatch = useAppDispatch();
  const bookingIsOpen = useAppSelector(selectBookingModalIsOpen);
  const dogId = useAppSelector(selectBookingModalDogId);
  const authIsOpen = useAppSelector(selectAuthModalIsOpen);

  const handleCloseBooking = () => dispatch(closeBookingModal());
  const handleCloseAuth = () => dispatch(closeAuthModal());

  if (bookingIsOpen) {
    return (
      <Modal isOpen onClose={handleCloseBooking} title={<h2>ЗАБРОНИРОВАТЬ</h2>}>
        <BookingModalContent dogId={dogId} onSuccess={handleCloseBooking} />
      </Modal>
    );
  }

  if (authIsOpen) {
    return (
      <Modal mode="large" isOpen onClose={handleCloseAuth}>
        <AuthModalContent />
      </Modal>
    );
  }

  return null;
}
