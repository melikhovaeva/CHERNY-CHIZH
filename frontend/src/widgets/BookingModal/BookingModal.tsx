import { Form, Modal } from '@/shared/ui/components'
import styles from './BookingModal.module.scss'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
}

export function BookingModal({ isOpen, onClose, onSubmit }: BookingModalProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onSubmit) {
      void Promise.resolve(onSubmit(event))
    } else {
      onClose()
    }
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