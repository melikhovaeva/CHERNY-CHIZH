/** Типы блоков контента статьи (согласованы с backend validate_content_blocks). */
export const CONTENT_BLOCK_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'file',
} as const;

export type ContentBlockType =
  (typeof CONTENT_BLOCK_TYPE)[keyof typeof CONTENT_BLOCK_TYPE];
