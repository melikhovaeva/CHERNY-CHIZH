import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type {
  Article,
  ArticleListItem,
  HomeLibraryResponse,
  PaginatedResponse,
} from '../model/types';

const DEFAULT_PAGE_SIZE = 12;

export interface GetArticlesListQueryArgs {
  page?: number;
  pageSize?: number;
  search?: string;
  /** Filter by content type: 'all' | 'articles'. Sent as content_type to BE. */
  contentType?: string;
}

function buildArticlesListQuery(args?: GetArticlesListQueryArgs): string {
  const params = new URLSearchParams();
  const page = args?.page ?? 1;
  if (page > 1) {
    params.set('page', String(page));
  }
  const pageSize = args?.pageSize ?? DEFAULT_PAGE_SIZE;
  if (pageSize > 0) {
    params.set('page_size', String(pageSize));
  }
  if (args?.search?.trim()) {
    params.set('search', args.search.trim());
  }
  const ct = args?.contentType?.trim().toLowerCase();
  if (ct === 'articles' || ct === 'article') {
    params.set('content_type', 'article');
  }
  const queryString = params.toString();
  const base = API_CONFIG.ENDPOINTS.ARTICLES;
  return queryString ? `${base}?${queryString}` : base;
}

export const articleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getArticleBySlug: build.query<Article, string>({
      query: (slug) => API_CONFIG.ENDPOINTS.ARTICLE_BY_SLUG(slug),
      providesTags: (_result, _err, slug) => [
        { type: API_CONFIG.TAG_TYPES.ARTICLES, id: slug },
      ],
    }),
    getHomeLibrary: build.query<HomeLibraryResponse, void>({
      query: () => API_CONFIG.ENDPOINTS.ARTICLES_HOME_LIBRARY,
      providesTags: [{ type: API_CONFIG.TAG_TYPES.ARTICLES, id: 'HOME_LIBRARY' }],
    }),
    getArticlesList: build.query<
      PaginatedResponse<ArticleListItem>,
      GetArticlesListQueryArgs | void
    >({
      query: (args) => buildArticlesListQuery(args ?? {}),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.ARTICLES,
                id: `list-${id}`,
              })),
              { type: API_CONFIG.TAG_TYPES.ARTICLES, id: 'LIST' },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.ARTICLES, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetArticleBySlugQuery,
  useGetHomeLibraryQuery,
  useGetArticlesListQuery,
} = articleApi;
