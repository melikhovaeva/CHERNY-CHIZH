import { useMeQuery } from '../api/session.api';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectSessionStatus,
  useAppSelector,
} from '@/app/redux';

export function useAuth(options?: { skip?: boolean }) {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectSessionStatus);

  const shouldFetchMe = !options?.skip && status === 'idle';

  const { isLoading: isMeLoading } = useMeQuery(undefined, {
    skip: !shouldFetchMe,
  });

  const isLoading = status === 'loading' || isMeLoading;

  return {
    user,
    isAuthenticated,
    isLoading,
    status,
  };
}

