import {
  CONTENT_BLOCK_TYPE,
  type ContentBlockType,
} from '@/entities/article';

/** Статусы публикации статьи (совпадают с backend InfoStatus). */
export const ARTICLE_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

/** Типы блоков редактора (совпадают с backend validate_content_blocks). */
export const BLOCK_TYPE = CONTENT_BLOCK_TYPE;

export type BlockTypeValue = ContentBlockType;

/** Задержка дебаунса для HTML текстового блока, мс. */
export const TEXT_BLOCK_DEBOUNCE_MS = 200;

/** Подписи тулбара текстового блока. */
export const TEXT_BLOCK_TOOLBAR = {
  RESET_LABEL: 'Сброс',
  RESET_TITLE: 'Сброс стилей',
  LINK_TITLE: 'Вставить ссылку',
  LINK_PROMPT: 'Адрес ссылки (пусто — убрать ссылку)',
  COLOR_TITLE: 'Цвет текста',
} as const;

/** Формат абзаца (formatBlock). */
export const TEXT_BLOCK_FORMAT_OPTIONS = [
  { value: 'p', label: 'Обычный' },
  { value: 'h2', label: 'Заголовок 2' },
  { value: 'h3', label: 'Заголовок 3' },
] as const;

/** Размер шрифта (document.execCommand fontSize 1–7). */
export const TEXT_BLOCK_FONT_SIZE_OPTIONS = [
  { value: '2', label: 'Мелкий' },
  { value: '3', label: 'Обычный' },
  { value: '5', label: 'Крупный' },
] as const;

/** Цвет текста по умолчанию (тулбар). */
export const TEXT_BLOCK_DEFAULT_FORE_COLOR = '#19191b';
