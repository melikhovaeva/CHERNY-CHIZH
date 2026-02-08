import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Puppy } from '../model/types';

export const puppyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPuppies: build.query<Puppy[], void>({
      query: () => API_CONFIG.ENDPOINTS.PUPPIES,
      providesTags: [API_CONFIG.TAG_TYPES.PUPPIES],
    }),
  }),
});

export const { useGetPuppiesQuery } = puppyApi;
