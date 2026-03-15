import { selectCurrentUser, selectIsAuthenticated, useAuth } from '@/entities/session';
import type { RoleCode } from '@/entities/session';
import { useAppSelector } from '@/app/store';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleCode[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = '/cabinet' }: RoleGuardProps) {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  const hasRole = isAuthenticated && user?.role != null && allowedRoles.includes(user.role.code as RoleCode);

  useEffect(() => {
    if (!isLoading && !hasRole) {
      void navigate({ to: redirectTo });
    }
  }, [isLoading, hasRole, redirectTo, navigate]);

  if (isLoading || !hasRole) {
    return null;
  }

  return <>{children}</>;
}
