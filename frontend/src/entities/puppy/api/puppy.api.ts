import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Puppy } from '../model/types';

export const puppyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPuppies: build.query<Puppy[], void>({
      query: () => API_CONFIG.ENDPOINTS.PUPPIES,
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
      query: (id) => `${API_CONFIG.ENDPOINTS.PUPPIES}${id}/`,
      providesTags: (_result, _err, id) => [
        { type: API_CONFIG.TAG_TYPES.PUPPIES, id },
      ],
    }),
  }),
});

export const { useGetPuppiesQuery, useGetPuppyQuery } = puppyApi;
