import { enhancedApi } from '@/shared/api/generated/courses.generated';
import type { InfoTagRead } from '@/shared/api/generated/articles.generated';

/** Типы блоков контента редактора статей (согласованы с backend validate_content_blocks). */
export interface TextBlock {
  id: string;
  type: 'text';
  html: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  url: string;
  title?: string;
  /** 'file' — загружен файлом; 'url' — вставлен по ссылке (YouTube, Vimeo, прямой URL). */
  sourceType?: 'file' | 'url';
}

export interface FileBlock {
  id: string;
  type: 'file';
  url: string;
  name: string;
  size: number;
}

export type ContentBlock = TextBlock | ImageBlock | VideoBlock | FileBlock;

export interface ArticleStatusLabel {
  code: string;
  label: string;
}

export interface ArticleAdminRead {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview: string | null;
  status: ArticleStatusLabel | null;
  tags: InfoTagRead[];
  contentBlocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleAdminWritePayload {
  title?: string;
  description?: string;
  status?: string;
  contentBlocks?: ContentBlock[];
  tags?: number[];
}

export interface ArticleAdminListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview: string | null;
  status: ArticleStatusLabel | null;
  tags: InfoTagRead[];
  createdAt: string;
}

export interface ArticleAdminCreatePayload {
  title: string;
  description?: string;
  tags?: number[];
}

export interface UploadMediaResponse {
  url: string;
  mediaType: 'image' | 'video' | 'file';
  name: string;
  size: number;
  contentType: string;
}

const EDUCATION_ARTICLE_ADMIN_TAG = 'Education' as const;

export const articleAdminApi = enhancedApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listAdminArticles: build.query<ArticleAdminListItem[], void>({
      query: () => ({ url: '/api/v1/education/articles/' }),
      providesTags: [EDUCATION_ARTICLE_ADMIN_TAG],
    }),
    createAdminArticle: build.mutation<ArticleAdminRead, ArticleAdminCreatePayload>({
      query: (data) => ({
        url: '/api/v1/education/articles/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [EDUCATION_ARTICLE_ADMIN_TAG],
    }),
    getArticleAdmin: build.query<ArticleAdminRead, string>({
      query: (slug) => ({
        url: `/api/v1/education/articles/${encodeURIComponent(slug)}/`,
      }),
      providesTags: (_result, _err, slug) => [
        { type: EDUCATION_ARTICLE_ADMIN_TAG, id: `articleAdmin:${slug}` },
      ],
    }),
    updateArticle: build.mutation<
      ArticleAdminRead,
      { slug: string; data: ArticleAdminWritePayload }
    >({
      query: ({ slug, data }) => ({
        url: `/api/v1/education/articles/${encodeURIComponent(slug)}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _err, { slug }) => [
        { type: EDUCATION_ARTICLE_ADMIN_TAG, id: `articleAdmin:${slug}` },
        EDUCATION_ARTICLE_ADMIN_TAG,
      ],
    }),
    deleteAdminArticle: build.mutation<void, string>({
      query: (slug) => ({
        url: `/api/v1/education/articles/${encodeURIComponent(slug)}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [EDUCATION_ARTICLE_ADMIN_TAG],
    }),
    uploadArticleImage: build.mutation<ArticleAdminRead, { slug: string; file: File }>({
      query: ({ slug, file }) => {
        const body = new FormData();
        body.append('image', file);
        return {
          url: `/api/v1/education/articles/${encodeURIComponent(slug)}/upload-image/`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _err, { slug }) => [
        { type: EDUCATION_ARTICLE_ADMIN_TAG, id: `articleAdmin:${slug}` },
        EDUCATION_ARTICLE_ADMIN_TAG,
      ],
    }),
    uploadArticleMedia: build.mutation<
      UploadMediaResponse,
      { slug: string; file: File }
    >({
      query: ({ slug, file }) => {
        const body = new FormData();
        body.append('file', file);
        return {
          url: `/api/v1/education/articles/${encodeURIComponent(slug)}/upload-media/`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useListAdminArticlesQuery,
  useCreateAdminArticleMutation,
  useGetArticleAdminQuery,
  useUpdateArticleMutation,
  useDeleteAdminArticleMutation,
  useUploadArticleImageMutation,
  useUploadArticleMediaMutation,
} = articleAdminApi;
