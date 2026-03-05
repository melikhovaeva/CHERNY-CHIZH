export type {
  CurrentUserRead as User,
  TokenObtainPairWrite as LoginRequest,
  RegisterStep1Write as RegisterStep1Request,
  RegisterStep2Write as RegisterStep2Request,
  PatchedCurrentUserRead,
  ChangePasswordWrite,
} from '@/shared/api/generated/users.generated';

export type { CurrentUserRead as LoginResponse } from '@/shared/api/generated/users.generated';

export type { V1UsersRegisterStep1CreateApiResponse as RegisterStep1Response } from '@/shared/api/generated/users.generated';

export type { CurrentUserRead as RegisterStep2Response } from '@/shared/api/generated/users.generated';
