export { CONTENT_BLOCK_TYPE, type ContentBlockType } from './config/contentBlockTypes';
export { normalizeContentBlocks } from './lib/normalizeContentBlocks';
export { resolveApiAssetUrl } from './lib/resolveApiAssetUrl';
export {
  resolveVideoEmbed,
  isEmbedUrl,
  type VideoEmbedInfo,
  type VideoEmbedType,
} from './lib/resolveVideoEmbed';
export {
  useGetArticleBySlugQuery,
  useGetHomeLibraryQuery,
  useGetArticlesListQuery,
} from './api/article.api';
export type { GetArticlesListQueryArgs } from './api/article.api';

export {
  articleAdminApi,
  useGetArticleAdminQuery,
  useUpdateArticleMutation,
  useUploadArticleMediaMutation,
} from './api/articleAdmin.api';
export type {
  ArticleAdminRead,
  ArticleAdminWritePayload,
  ArticleStatusLabel,
  ContentBlock,
  FileBlock,
  ImageBlock,
  TextBlock,
  UploadMediaResponse,
  VideoBlock,
} from './api/articleAdmin.api';
export { ArticleContentPreview } from './ui/ArticleContentPreview/ArticleContentPreview';
export type { ArticleContentPreviewProps } from './ui/ArticleContentPreview/ArticleContentPreview';
export type {
  Article,
  ArticleAuthor,
  ArticleListItem,
  ArticleMinimal,
  HomeLibraryResponse,
  HomeLibraryTag,
  PaginatedResponse,
} from './model/types';
