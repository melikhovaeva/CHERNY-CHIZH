import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterStep1Request,
  RegisterStep1Response,
  RegisterStep2Request,
  RegisterStep2Response,
  User,
} from './types';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerStep1: build.mutation<RegisterStep1Response, RegisterStep1Request>({
      query: (body) => ({
        url: API_CONFIG.ENDPOINTS.REGISTER_STEP1,
        method: 'POST',
        body,
      }),
    }),
    registerStep2: build.mutation<RegisterStep2Response, RegisterStep2Request>({
      query: (body) => ({
        url: API_CONFIG.ENDPOINTS.REGISTER_STEP2,
        method: 'POST',
        body: {
          ...body,
          phone: body.phone || undefined,
          messenger: body.messenger || undefined,
        },
      }),
      invalidatesTags: [API_CONFIG.TAG_TYPES.SESSION],
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: API_CONFIG.ENDPOINTS.LOGIN,
        method: 'POST',
        body,
      }),
      invalidatesTags: [API_CONFIG.TAG_TYPES.SESSION],
    }),
    me: build.query<User, void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.ME,
        method: 'GET',
      }),
      providesTags: [API_CONFIG.TAG_TYPES.SESSION],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: [API_CONFIG.TAG_TYPES.SESSION],
    }),
  }),
});

export const {
  useRegisterStep1Mutation,
  useRegisterStep2Mutation,
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
} = sessionApi;
