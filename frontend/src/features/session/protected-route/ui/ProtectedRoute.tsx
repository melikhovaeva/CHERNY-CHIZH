import { openAuthModal, selectAuthModalIsOpen } from '@/features/auth-modal';
import { selectIsAuthenticated, useAuth } from '@/entities/session';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthModalOpen = useAppSelector(selectAuthModalIsOpen);
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      dispatch(openAuthModal());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthModalOpen) {
      navigate({ to: '/' });
    }
  }, [isLoading, isAuthenticated, isAuthModalOpen, navigate]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
