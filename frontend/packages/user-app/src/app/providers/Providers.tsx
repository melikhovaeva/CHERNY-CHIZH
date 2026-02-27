import { useAuth } from '@/entities/session';
import { ToastProvider } from 'common';
import { ModalHost } from './ModalHost';
import { StoreProvider } from './store/StoreProvider';

const AppBootstrap = ({ children }: { children: React.ReactNode }) => {
  useAuth();
  return (
    <>
      <ModalHost />
      {children}
    </>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ToastProvider position="bottom-right">
        <AppBootstrap>{children}</AppBootstrap>
      </ToastProvider>
    </StoreProvider>
  );
};
