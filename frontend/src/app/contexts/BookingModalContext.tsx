import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { BookingModal } from '@/widgets'

interface BookingModalContextValue {
  openBookingModal: () => void
  closeBookingModal: () => void
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null)

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openBookingModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeBookingModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <BookingModalContext.Provider
      value={{ openBookingModal, closeBookingModal }}
    >
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBookingModal} />
    </BookingModalContext.Provider>
  )
}

export function useBookingModal(): BookingModalContextValue {
  const value = useContext(BookingModalContext)
  if (value == null) {
    throw new Error('useBookingModal must be used within BookingModalProvider')
  }
  return value
}
