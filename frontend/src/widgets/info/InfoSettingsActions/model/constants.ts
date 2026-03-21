import { INFO_TYPE } from '@/shared/config/info';

export const INFO_PUBLISH_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

export type InfoPublishStatus =
  (typeof INFO_PUBLISH_STATUS)[keyof typeof INFO_PUBLISH_STATUS];

export const INFO_PUBLISH_STATUS_LABEL: Record<InfoPublishStatus, string> = {
  [INFO_PUBLISH_STATUS.UNPUBLISHED]: 'Не опубликован',
  [INFO_PUBLISH_STATUS.PUBLISHED]: 'Опубликован',
} as const;

const COURSE_PUBLISH_HINT = 'Курс станет доступным для прохождения';
const ARTICLE_PUBLISH_HINT = 'Статья станет доступна для просмотра';

const COURSE_UNPUBLISH_HINT = 'Курс станет недоступным для прохождения';
const ARTICLE_UNPUBLISH_HINT = 'Статья станет недоступна для просмотра';

export const INFO_UNPUBLISH_HINTS = {
  [INFO_TYPE.COURSE]: COURSE_UNPUBLISH_HINT,
  [INFO_TYPE.ARTICLE]: ARTICLE_UNPUBLISH_HINT,
} as const;

export const INFO_PUBLISH_HINTS = {
  [INFO_TYPE.COURSE]: COURSE_PUBLISH_HINT,
  [INFO_TYPE.ARTICLE]: ARTICLE_PUBLISH_HINT,
} as const;

const COURSE_DELETE_BUTTON_TEXT = 'Удалить курс';
const ARTICLE_DELETE_BUTTON_TEXT = 'Удалить статью';

export const INFO_DELETE_BUTTON_TEXT = {
  [INFO_TYPE.COURSE]: COURSE_DELETE_BUTTON_TEXT,
  [INFO_TYPE.ARTICLE]: ARTICLE_DELETE_BUTTON_TEXT,
} as const;

const COURSE_UNPUBLISH_DIALOG_TITLE = 'Снять курс с публикации?';
const ARTICLE_UNPUBLISH_DIALOG_TITLE = 'Снять статью с публикации?';

export const INFO_UNPUBLISH_DIALOG_TITLE = {
  [INFO_TYPE.COURSE]: COURSE_UNPUBLISH_DIALOG_TITLE,
  [INFO_TYPE.ARTICLE]: ARTICLE_UNPUBLISH_DIALOG_TITLE,
} as const;

const COURSE_UNPUBLISH_DIALOG_DESCRIPTION =
  'После снятия с публикации ученики потеряют доступ к курсу.';
const ARTICLE_UNPUBLISH_DIALOG_DESCRIPTION =
  'После снятия с публикации статья станет недоступна для просмотра.';

export const INFO_UNPUBLISH_DIALOG_DESCRIPTION = {
  [INFO_TYPE.COURSE]: COURSE_UNPUBLISH_DIALOG_DESCRIPTION,
  [INFO_TYPE.ARTICLE]: ARTICLE_UNPUBLISH_DIALOG_DESCRIPTION,
} as const;

const COURSE_PUBLISH_DIALOG_TITLE = 'Опубликовать курс?';
const ARTICLE_PUBLISH_DIALOG_TITLE = 'Опубликовать статью?';

export const INFO_PUBLISH_DIALOG_TITLE = {
  [INFO_TYPE.COURSE]: COURSE_PUBLISH_DIALOG_TITLE,
  [INFO_TYPE.ARTICLE]: ARTICLE_PUBLISH_DIALOG_TITLE,
} as const;

const COURSE_PUBLISH_DIALOG_DESCRIPTION =
  'После публикации курс станет доступным для прохождения.';
const ARTICLE_PUBLISH_DIALOG_DESCRIPTION =
  'После публикации статья станет доступна для просмотра.';

export const INFO_PUBLISH_DIALOG_DESCRIPTION = {
  [INFO_TYPE.COURSE]: COURSE_PUBLISH_DIALOG_DESCRIPTION,
  [INFO_TYPE.ARTICLE]: ARTICLE_PUBLISH_DIALOG_DESCRIPTION,
} as const;
