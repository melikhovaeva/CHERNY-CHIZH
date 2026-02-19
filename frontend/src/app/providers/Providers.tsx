import { StoreProvider } from './store/StoreProvider'
import { ModalHost } from './ModalHost'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ModalHost />
      {children}
    </StoreProvider>
  )
}