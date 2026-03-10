import type {
  V1ArticlesListApiArg,
  V1ArticlesListApiResponse,
} from '@/shared/api/generated/articles.generated';
import {
  enhancedApi,
  useV1ArticlesHomeLibraryRetrieveQuery,
  useV1ArticlesListQuery,
  useV1ArticlesRetrieveQuery,
} from '@/shared/api/generated/articles.generated';
import type { HomeLibraryResponse } from '../model/types';

export const articleApi = enhancedApi;

enhancedApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    v1ArticlesList: build.query<
      V1ArticlesListApiResponse,
      V1ArticlesListApiArg & { search?: string }
    >({
      query: (queryArg) => ({
        url: '/api/v1/articles/',
        params: {
          limit: queryArg.limit,
          offset: queryArg.offset,
          ...(queryArg.search?.trim()
            ? { search: queryArg.search.trim() }
            : {}),
        },
      }),
    }),
  }),
});

const DEFAULT_PAGE_SIZE = 12;

export interface GetArticlesListQueryArgs {
  page?: number;
  pageSize?: number;
  search?: string;
  /** Filter by content type: 'all' | 'articles'. Sent as content_type to BE. */
  contentType?: string;
}

/** Wrapper: app uses slug string; generated hook expects { slug }. */
export function useGetArticleBySlugQuery(
  slug: string,
  options?: Parameters<typeof useV1ArticlesRetrieveQuery>[1],
) {
  return useV1ArticlesRetrieveQuery({ slug }, options);
}

/** Real API returns tags+groups; schema types it as ArticleRead. We type as HomeLibraryResponse for widgets. */
export function useGetHomeLibraryQuery(
  options?: Parameters<typeof useV1ArticlesHomeLibraryRetrieveQuery>[1],
) {
  const result = useV1ArticlesHomeLibraryRetrieveQuery(undefined, options);
  return {
    ...result,
    data: result.data as unknown as HomeLibraryResponse | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    isSuccess: result.isSuccess,
    isUninitialized: result.isUninitialized,
    refetch: result.refetch,
    currentData: result.currentData as unknown as
      | HomeLibraryResponse
      | undefined,
  };
}

/** Wrapper: app uses page/pageSize; generated uses limit/offset. search передаётся в переопределённом эндпоинте. */
export function useGetArticlesListQuery(
  args?: GetArticlesListQueryArgs | void,
  options?: Parameters<typeof useV1ArticlesListQuery>[1],
) {
  const page = args?.page ?? 1;
  const pageSize = args?.pageSize ?? DEFAULT_PAGE_SIZE;
  return useV1ArticlesListQuery(
    {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      ...(args?.search != null && args.search !== ''
        ? { search: args.search }
        : {}),
    },
    options,
  );
}
