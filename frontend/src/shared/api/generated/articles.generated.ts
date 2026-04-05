import { baseApi as api } from "../base-api";
export const addTagTypes = ["Articles"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1ArticlesList: build.query<
        V1ArticlesListApiResponse,
        V1ArticlesListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/articles/`,
          params: {
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Articles"],
      }),
      v1ArticlesRetrieve: build.query<
        V1ArticlesRetrieveApiResponse,
        V1ArticlesRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/articles/${queryArg.slug}/` }),
        providesTags: ["Articles"],
      }),
      v1ArticlesHomeLibraryRetrieve: build.query<
        V1ArticlesHomeLibraryRetrieveApiResponse,
        V1ArticlesHomeLibraryRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/articles/home-library/` }),
        providesTags: ["Articles"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1ArticlesListApiResponse =
  /** status 200  */ PaginatedArticleListListRead;
export type V1ArticlesListApiArg = {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1ArticlesRetrieveApiResponse = /** status 200  */ ArticleRead;
export type V1ArticlesRetrieveApiArg = {
  slug: string;
};
export type V1ArticlesHomeLibraryRetrieveApiResponse =
  /** status 200  */ ArticleRead;
export type V1ArticlesHomeLibraryRetrieveApiArg = void;
export type ArticleList = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
};
export type InfoTag = {
  code: string;
  label: string;
  order?: number;
};
export type InfoTagRead = {
  id: number;
  code: string;
  label: string;
  order?: number;
};
export type ArticleListRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  tags: InfoTagRead[];
  createdAt: string;
  author: {
    [key: string]: any;
  };
};
export type PaginatedArticleListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleList[];
};
export type PaginatedArticleListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleListRead[];
};
export type Article = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
};
export type CodeLabel = {
  code: string;
  label: string;
};
export type ArticleRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  status: CodeLabel;
  tags: InfoTagRead[];
  contentBlocks: {
    [key: string]: any;
  }[];
  createdAt: string;
  updatedAt: string;
};
export const {
  useV1ArticlesListQuery,
  useV1ArticlesRetrieveQuery,
  useV1ArticlesHomeLibraryRetrieveQuery,
} = injectedRtkApi;
