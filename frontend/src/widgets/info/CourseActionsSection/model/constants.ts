export const COURSE_PUBLISH_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

export type CoursePublishStatus =
  (typeof COURSE_PUBLISH_STATUS)[keyof typeof COURSE_PUBLISH_STATUS];

export const COURSE_PUBLISH_STATUS_LABEL: Record<CoursePublishStatus, string> = {
  [COURSE_PUBLISH_STATUS.UNPUBLISHED]: 'Не опубликован',
  [COURSE_PUBLISH_STATUS.PUBLISHED]: 'Опубликован',
} as const;
