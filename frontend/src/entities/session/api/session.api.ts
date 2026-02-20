import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type {
  RegisterStep1Request,
  RegisterStep1Response,
  RegisterStep2Request,
  RegisterStep2Response,
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
          telegram: body.telegram || undefined,
        },
      }),
      invalidatesTags: [API_CONFIG.TAG_TYPES.SESSION],
    }),
  }),
});

export const { useRegisterStep1Mutation, useRegisterStep2Mutation } = sessionApi;
