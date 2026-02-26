import {
  openAuthModal,
  selectAuthModalIsOpen,
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux';
import { useAuth } from '@/entities/session';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

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

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

