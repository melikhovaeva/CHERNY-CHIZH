import { Form, Modal } from '@/shared/ui/components'
import styles from './BookingModal.module.scss'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: submit booking request
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<h2 className={styles.title}>ЗАБРОНИРОВАТЬ</h2>}
    >
      <Form onSubmit={handleSubmit} />
    </Modal>
  )
}
0