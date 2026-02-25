import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { PaginatedResponse, Puppy } from '../model/types';

const DEFAULT_PAGE_SIZE = 20;

export interface GetDogsQueryArgs {
  page?: number;
  skip?: number;
  pageSize?: number;
}

export interface GetDogsByBreedQueryArgs {
  breedSlug: string;
  page?: number;
  skip?: number;
  pageSize?: number;
}

const buildDogsPaginationQuery = (base: string, args?: GetDogsQueryArgs) => {
  const params = new URLSearchParams();
  params.set('age_group', 'adult');

  if (args?.skip != null) {
    params.set('skip', String(args.skip));
  }

  const page = args?.page ?? 1;
  if (page > 1) {
    params.set('page', String(page));
  }

  const pageSize = args?.pageSize ?? DEFAULT_PAGE_SIZE;
  if (pageSize > 0) {
    params.set('page_size', String(pageSize));
  }

  const queryString = params.toString();
  return `${base}?${queryString}`;
};

export const dogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDogs: build.query<PaginatedResponse<Puppy>, GetDogsQueryArgs | void>({
      query: (args) =>
        buildDogsPaginationQuery(
          API_CONFIG.ENDPOINTS.DOGS,
          args ?? { page: 1 },
        ),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.DOGS,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.DOGS, id: 'LIST' }],
    }),
    getDogsByBreed: build.query<
      PaginatedResponse<Puppy>,
      GetDogsByBreedQueryArgs
    >({
      query: ({ breedSlug, ...args }) =>
        buildDogsPaginationQuery(
          API_CONFIG.ENDPOINTS.DOGS_BY_BREED(breedSlug),
          args,
        ),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
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
