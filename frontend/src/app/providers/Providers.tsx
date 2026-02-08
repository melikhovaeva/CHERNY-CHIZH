import { BookingModalView } from '@/widgets'
import { StoreProvider } from './store/StoreProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <BookingModalView />
      {children}
    </StoreProvider>
  )
}