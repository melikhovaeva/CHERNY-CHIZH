import { useAuth } from '@/entities/session'
import { StoreProvider } from './store/StoreProvider'
import { ModalHost } from './ModalHost'

const AppBootstrap = ({ children }: { children: React.ReactNode }) => {
  useAuth()
  return (
    <>
      <ModalHost />
      {children}
    </>
  )
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AppBootstrap>{children}</AppBootstrap>
    </StoreProvider>
  )
}