import { baseApi as api } from "../base-api";
export const addTagTypes = ["Users", "Auth"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1UsersAdminUsersList: build.query<
        V1UsersAdminUsersListApiResponse,
        V1UsersAdminUsersListApiArg
      >({
        query: () => ({ url: `/api/v1/users/admin/users/` }),
        providesTags: ["Users"],
      }),
      v1UsersAdminUsersRetrieve: build.query<
        V1UsersAdminUsersRetrieveApiResponse,
        V1UsersAdminUsersRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/admin/users/${queryArg.id}/`,
        }),
        providesTags: ["Users"],
      }),
      v1UsersAdminUsersPartialUpdate: build.mutation<
        V1UsersAdminUsersPartialUpdateApiResponse,
        V1UsersAdminUsersPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/admin/users/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedUserRoleUpdate,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersAuthLoginCreate: build.mutation<
        V1UsersAuthLoginCreateApiResponse,
        V1UsersAuthLoginCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/auth/login/`,
          method: "POST",
          body: queryArg.tokenObtainPair,
        }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersAuthLogoutCreate: build.mutation<
        V1UsersAuthLogoutCreateApiResponse,
        V1UsersAuthLogoutCreateApiArg
      >({
        query: () => ({ url: `/api/v1/users/auth/logout/`, method: "POST" }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersAuthRefreshCreate: build.mutation<
        V1UsersAuthRefreshCreateApiResponse,
        V1UsersAuthRefreshCreateApiArg
      >({
        query: () => ({ url: `/api/v1/users/auth/refresh/`, method: "POST" }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersMeRetrieve: build.query<
        V1UsersMeRetrieveApiResponse,
        V1UsersMeRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/` }),
        providesTags: ["Users"],
      }),
      v1UsersMeUpdate: build.mutation<
        V1UsersMeUpdateApiResponse,
        V1UsersMeUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/`,
          method: "PUT",
          body: queryArg.currentUser,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMePartialUpdate: build.mutation<
        V1UsersMePartialUpdateApiResponse,
        V1UsersMePartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/`,
          method: "PATCH",
          body: queryArg.patchedCurrentUser,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeDestroy: build.mutation<
        V1UsersMeDestroyApiResponse,
        V1UsersMeDestroyApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/`, method: "DELETE" }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeChangePasswordCreate: build.mutation<
        V1UsersMeChangePasswordCreateApiResponse,
        V1UsersMeChangePasswordCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/change-password/`,
          method: "POST",
          body: queryArg.changePassword,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeCoursesList: build.query<
        V1UsersMeCoursesListApiResponse,
        V1UsersMeCoursesListApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/courses/` }),
        providesTags: ["Users"],
      }),
      v1UsersRegisterStep1Create: build.mutation<
        V1UsersRegisterStep1CreateApiResponse,
        V1UsersRegisterStep1CreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/register/step1/`,
          method: "POST",
          body: queryArg.registerStep1,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersRegisterStep2Create: build.mutation<
        V1UsersRegisterStep2CreateApiResponse,
        V1UsersRegisterStep2CreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/register/step2/`,
          method: "POST",
          body: queryArg.registerStep2,
        }),
        invalidatesTags: ["Users"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1UsersAdminUsersListApiResponse = /** status 200  */ UserRead[];
export type V1UsersAdminUsersListApiArg = void;
export type V1UsersAdminUsersRetrieveApiResponse = /** status 200  */ UserRead;
export type V1UsersAdminUsersRetrieveApiArg = {
  id: number;
};
export type V1UsersAdminUsersPartialUpdateApiResponse =
  /** status 200  */ UserRead;
export type V1UsersAdminUsersPartialUpdateApiArg = {
  id: number;
  patchedUserRoleUpdate: PatchedUserRoleUpdate;
};
export type V1UsersAuthLoginCreateApiResponse =
  /** status 200  */ CurrentUserRead;
export type V1UsersAuthLoginCreateApiArg = {
  tokenObtainPair: TokenObtainPairWrite;
};
export type V1UsersAuthLogoutCreateApiResponse = unknown;
export type V1UsersAuthLogoutCreateApiArg = void;
export type V1UsersAuthRefreshCreateApiResponse = unknown;
export type V1UsersAuthRefreshCreateApiArg = void;
export type V1UsersMeRetrieveApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeRetrieveApiArg = void;
export type V1UsersMeUpdateApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeUpdateApiArg = {
  currentUser: CurrentUser;
};
export type V1UsersMePartialUpdateApiResponse =
  /** status 200  */ CurrentUserRead;
export type V1UsersMePartialUpdateApiArg = {
  patchedCurrentUser: PatchedCurrentUser;
};
export type V1UsersMeDestroyApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeDestroyApiArg = void;
export type V1UsersMeChangePasswordCreateApiResponse = unknown;
export type V1UsersMeChangePasswordCreateApiArg = {
  changePassword: ChangePasswordWrite;
};
export type V1UsersMeCoursesListApiResponse =
  /** status 200  */ CourseEnrollmentRead[];
export type V1UsersMeCoursesListApiArg = void;
export type V1UsersRegisterStep1CreateApiResponse = /** status 200  */ {
  [key: string]: any;
};
export type V1UsersRegisterStep1CreateApiArg = {
  registerStep1: RegisterStep1Write;
};
export type V1UsersRegisterStep2CreateApiResponse =
  /** status 201  */ CurrentUserRead;
export type V1UsersRegisterStep2CreateApiArg = {
  registerStep2: RegisterStep2Write;
};
export type User = {
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
};
export type Role = {};
export type RoleRead = {
  code: string;
  label: string;
};
export type UserRead = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
  role: RoleRead | null;
  dateJoined: string;
  isActive: boolean;
};
export type PatchedUserRoleUpdate = {
  role?: number | null;
};
export type CurrentUser = {
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
};
export type CurrentUserRead = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage: string;
  role: RoleRead | null;
};
export type TokenObtainPair = {};
export type TokenObtainPairRead = {
  access: string;
  refresh: string;
};
export type TokenObtainPairWrite = {
  email: string;
  password: string;
};
export type PatchedCurrentUser = {
  email?: string;
  firstName?: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
};
export type PatchedCurrentUserRead = {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string;
  role?: RoleRead | null;
};
export type ChangePassword = {};
export type ChangePasswordWrite = {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
};
export type CourseEnrollmentStatusEnum = "enrolled" | "completed" | "cancelled";
export type CourseEnrollment = {
  status?: CourseEnrollmentStatusEnum;
  /** Прогресс прохождения курса в процентах */
  progress?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
};
export type DifficultyEnum = "beginner" | "intermediate" | "advanced";
export type Course = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
};
export type CodeLabel = {
  code: string;
  label: string;
};
export type InfoTag = {
  code: string;
  label: string;
  order?: number;
};
export type InfoTagRead = {
  id: number;
  code: string;
  label: string;
  order?: number;
};
export type CourseRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
  status: CodeLabel;
  tags: InfoTagRead[];
  createdAt: string;
  updatedAt: string;
};
export type CourseEnrollmentRead = {
  id: number;
  course: CourseRead;
  status?: CourseEnrollmentStatusEnum;
  /** Прогресс прохождения курса в процентах */
  progress?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
};
export type RegisterStep1 = {
  email: string;
};
export type RegisterStep1Write = {
  email: string;
  password: string;
  password2: string;
};
export type RegisterStep2 = {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  messenger?: string;
};
export type RegisterStep2Write = {
  email: string;
  password: string;
  password2: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  messenger?: string;
};
export const {
  useV1UsersAdminUsersListQuery,
  useV1UsersAdminUsersRetrieveQuery,
  useV1UsersAdminUsersPartialUpdateMutation,
  useV1UsersAuthLoginCreateMutation,
  useV1UsersAuthLogoutCreateMutation,
  useV1UsersAuthRefreshCreateMutation,
  useV1UsersMeRetrieveQuery,
  useV1UsersMeUpdateMutation,
  useV1UsersMePartialUpdateMutation,
  useV1UsersMeDestroyMutation,
  useV1UsersMeChangePasswordCreateMutation,
  useV1UsersMeCoursesListQuery,
  useV1UsersRegisterStep1CreateMutation,
  useV1UsersRegisterStep2CreateMutation,
} = injectedRtkApi;
