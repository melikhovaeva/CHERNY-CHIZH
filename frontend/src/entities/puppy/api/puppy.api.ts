import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Puppy } from '../model/types';

export const puppyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPuppies: build.query<Puppy[], void>({
      query: () =>
        `${API_CONFIG.ENDPOINTS.DOGS}?age_group=puppy`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.PUPPIES,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.PUPPIES, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.PUPPIES, id: 'LIST' }],
    }),
    getPuppy: build.query<Puppy, number>({
      query: (id) =>
        `${API_CONFIG.ENDPOINTS.DOGS}${id}/`,
      providesTags: (_result, _err, id) => [
        { type: API_CONFIG.TAG_TYPES.PUPPIES, id },
      ],
    }),
    getPuppiesByBreed: build.query<Puppy[], string>({
      query: (breedSlug: string) =>
        `${API_CONFIG.ENDPOINTS.DOGS_BY_BREED(breedSlug)}?age_group=puppy`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.PUPPIES,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.PUPPIES, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.PUPPIES, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPuppiesQuery,
  useGetPuppyQuery,
  useGetPuppiesByBreedQuery,
} = puppyApi;
