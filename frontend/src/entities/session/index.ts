export {
  useRegisterStep1Mutation,
  useRegisterStep2Mutation,
  useLoginMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} from './api/session.api';

export type {
  RegisterStep1Request,
  RegisterStep1Response,
  RegisterStep2Request,
  RegisterStep2Response,
  LoginRequest,
  LoginResponse,
  User,
} from './api/types';

export { useAuth } from './model/useAuth';

export {
  sessionSlice,
  setUser,
  clearSession,
  setStatus,
  setError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectSessionStatus,
  selectSessionError,
  selectCurrentUserRole,
  selectIsAdmin,
  SessionStatusEnum,
} from './model/sessionSlice';

export { ROLE_CODES } from './model/roleCodes';
export type { RoleCode } from './model/roleCodes';

