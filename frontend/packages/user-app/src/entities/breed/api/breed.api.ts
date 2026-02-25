import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Breed } from '../model/types';

export const breedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBreeds: build.query<Breed[], void>({
      query: () => API_CONFIG.ENDPOINTS.BREEDS,
      providesTags: [API_CONFIG.TAG_TYPES.BREEDS],
    }),
  }),
});

export const { useGetBreedsQuery } = breedApi;
