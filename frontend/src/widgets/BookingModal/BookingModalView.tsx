import {
  closeBookingModal,
  selectBookingModalIsOpen,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux'
import { useSubmitBookingMutation } from '@/shared/api/booking-api'
import { BookingModal } from './BookingModal'

export function BookingModalView() {
  const isOpen = useAppSelector(selectBookingModalIsOpen)
  const dispatch = useAppDispatch()
  const [submitBooking] = useSubmitBookingMutation()

  const handleClose = () => {
    dispatch(closeBookingModal())
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await submitBooking({
        name: '',
        phone: '',
      }).unwrap()
      dispatch(closeBookingModal())
    } catch {
      // TODO: handle error
    }
  }

  return (
    <BookingModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  )
}
