import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { PaginatedResponse, Puppy } from '../model/types';

const DEFAULT_PAGE_SIZE = 20;

export interface GetPuppiesQueryArgs {
  page?: number;
  skip?: number;
  pageSize?: number;
}

export interface GetPuppiesByBreedQueryArgs {
  breedSlug: string;
  page?: number;
  skip?: number;
  pageSize?: number;
}

const buildPaginationQuery = (base: string, args?: GetPuppiesQueryArgs) => {
  const params = new URLSearchParams();
  params.set('age_group', 'puppy');

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

export const puppyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPuppies: build.query<PaginatedResponse<Puppy>, GetPuppiesQueryArgs | void>({
      query: (args) =>
        buildPaginationQuery(API_CONFIG.ENDPOINTS.DOGS, args ?? { page: 1 }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
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
    getPuppiesByBreed: build.query<
      PaginatedResponse<Puppy>,
      GetPuppiesByBreedQueryArgs
    >({
      query: ({ breedSlug, ...args }) =>
        buildPaginationQuery(API_CONFIG.ENDPOINTS.DOGS_BY_BREED(breedSlug), args),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
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
