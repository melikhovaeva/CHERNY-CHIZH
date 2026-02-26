import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { Article, HomeLibraryResponse } from '../model/types';

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
  }),
});

export const { useGetArticleBySlugQuery, useGetHomeLibraryQuery } = articleApi;
