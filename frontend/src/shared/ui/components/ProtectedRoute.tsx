import { openAuthModal, selectIsAuthenticated, useAppDispatch, useAppSelector } from '@/app/redux';
import { useAuth } from '@/entities/session';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      dispatch(openAuthModal());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

