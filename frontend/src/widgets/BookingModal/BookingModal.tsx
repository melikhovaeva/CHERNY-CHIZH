import { Modal } from '@/shared/ui/components';
import styles from './BookingModal.module.scss';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BookingModal({ isOpen, onClose, children }: BookingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<h2 className={styles.title}>ЗАБРОНИРОВАТЬ</h2>}
    >
      {children}
    </Modal>
  );
}
