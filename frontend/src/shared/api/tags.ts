import { baseApi } from './base-api';
import type { InfoTagRead as ArticleTagRead } from './generated/articles.generated';

export type TagRead = ArticleTagRead;

export type TagsListResponse =
  | {
      count: number;
      next?: string | null;
      previous?: string | null;
      results: TagRead[];
    }
  | TagRead[];

export type TagsListArgs = {
  q?: string;
  limit?: number;
  offset?: number;
};

export type TagCreate = Pick<TagRead, 'code' | 'label'>;

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    v1EducationTagsList: build.query<TagsListResponse, TagsListArgs>({
      query: (params) => ({
        url: '/api/v1/education/tags',
        params,
      }),
    }),
    v1EducationTagsCreate: build.mutation<TagRead[], TagCreate[]>({
      query: (body) => ({
        url: '/api/v1/education/tags',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useV1EducationTagsListQuery,
  useV1EducationTagsCreateMutation,
} = tagsApi;

