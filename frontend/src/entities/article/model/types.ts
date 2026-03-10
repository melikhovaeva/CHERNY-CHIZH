export type {
  ArticleRead as Article,
  ArticleListRead as ArticleListItem,
  ArticleList,
  InfoTag,
  InfoTagRead,
  CodeLabel,
  PaginatedArticleListListRead,
} from '@/shared/api/generated/articles.generated';

/** Generic pagination shape for list endpoints. */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Local: real home-library API returns this; schema currently types as ArticleRead. */
export interface HomeLibraryTag {
  id: number;
  code: string;
  label: string;
  order: number;
}

export interface HomeLibraryResponse {
  tags: HomeLibraryTag[];
  groups: Array<{
    tagId: number;
    articles: import('@/shared/api/generated/articles.generated').ArticleListRead[];
  }>;
}

/** Alias for list item (same as ArticleListItem from schema). */
export type ArticleMinimal = import('@/shared/api/generated/articles.generated').ArticleListRead;

export interface ArticleAuthor {
  avatar: string | null;
  displayName: string;
}
