import {
  closeAuthModal,
  closeBookingModal,
  selectAuthModalIsOpen,
  selectBookingModalIsOpen,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux';
import { Modal } from '@/shared/ui/components';
import { AuthModalContent } from '@/widgets/AuthModal';
import { BookingModalContent } from '@/widgets/BookingModal';

export function ModalHost() {
  const dispatch = useAppDispatch();
  const bookingIsOpen = useAppSelector(selectBookingModalIsOpen);
  const authIsOpen = useAppSelector(selectAuthModalIsOpen);

  const handleCloseBooking = () => dispatch(closeBookingModal());
  const handleCloseAuth = () => dispatch(closeAuthModal());

  if (bookingIsOpen) {
    return (
      <Modal
        isOpen
        onClose={handleCloseBooking}
        title={<h2>ЗАБРОНИРОВАТЬ</h2>}
      >
        <BookingModalContent onSuccess={handleCloseBooking} />
      </Modal>
    );
  }

  if (authIsOpen) {
    return (
      <Modal
        isOpen
        onClose={handleCloseAuth}
        title={<h2>Вход</h2>}
      >
        <AuthModalContent onClose={handleCloseAuth} />
      </Modal>
    );
  }

  return null;
}
