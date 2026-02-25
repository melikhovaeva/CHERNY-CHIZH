import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Puppy } from '../model/types';

export const dogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDogs: build.query<Puppy[], void>({
      query: () => `${API_CONFIG.ENDPOINTS.DOGS}?age_group=adult`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.DOGS,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' }],
    }),
    getDogsByBreed: build.query<Puppy[], string>({
      query: (breedSlug: string) =>
        `${API_CONFIG.ENDPOINTS.DOGS_BY_BREED(breedSlug)}?age_group=adult`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.DOGS,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' }],
    }),
  }),
});

export const { useGetDogsQuery, useGetDogsByBreedQuery } = dogApi;
