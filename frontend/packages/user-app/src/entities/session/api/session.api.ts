import {
  enhancedApi,
  useV1UsersAuthLoginCreateMutation,
  useV1UsersAuthLogoutCreateMutation,
  useV1UsersMeRetrieveQuery,
  useV1UsersMePartialUpdateMutation,
  useV1UsersMeChangePasswordCreateMutation,
  useV1UsersRegisterStep1CreateMutation,
  useV1UsersRegisterStep2CreateMutation,
} from '@/shared/api/generated/users.generated';
import type { PatchedCurrentUserRead } from '@/shared/api/generated/users.generated';

export const sessionApi = enhancedApi;

export const useLoginMutation = useV1UsersAuthLoginCreateMutation;
export const useLogoutMutation = useV1UsersAuthLogoutCreateMutation;
export const useMeQuery = useV1UsersMeRetrieveQuery;
export const useRegisterStep1Mutation = useV1UsersRegisterStep1CreateMutation;
export const useRegisterStep2Mutation = useV1UsersRegisterStep2CreateMutation;

/** App profile payload (snake_case); maps to patchedCurrentUser (camelCase) for API. */
export type UpdateProfilePayload = Partial<{
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  messenger: string | null;
}>;

function toPatchedCurrentUser(p: UpdateProfilePayload): PatchedCurrentUserRead {
  const out: PatchedCurrentUserRead = {};
  if (p.email !== undefined) out.email = p.email;
  if (p.first_name !== undefined) out.firstName = p.first_name;
  if (p.last_name !== undefined) out.lastName = p.last_name;
  if (p.phone !== undefined) out.phone = p.phone;
  if (p.messenger !== undefined) out.messenger = p.messenger;
  return out;
}

export function useUpdateProfileMutation() {
  const [mutate, rest] = useV1UsersMePartialUpdateMutation();
  const updateProfile = (payload: UpdateProfilePayload) =>
    mutate({ patchedCurrentUser: toPatchedCurrentUser(payload) });
  return [updateProfile, rest] as const;
}

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
};

export function useChangePasswordMutation() {
  const [mutate, rest] = useV1UsersMeChangePasswordCreateMutation();
  const changePassword = (payload: ChangePasswordPayload) =>
    mutate({ changePassword: payload });
  return [changePassword, rest] as const;
}
