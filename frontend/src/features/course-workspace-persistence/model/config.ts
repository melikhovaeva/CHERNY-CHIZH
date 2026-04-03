export const COURSE_WORKSPACE_TAB = {
  PREVIEW: 'preview',
  CONSTRUCTOR: 'constructor',
  SETTINGS: 'settings',
} as const;

export type CourseWorkspaceTab =
  (typeof COURSE_WORKSPACE_TAB)[keyof typeof COURSE_WORKSPACE_TAB];

export const COURSE_WORKSPACE_STORAGE_SCHEMA_VERSION = 1;

const COURSE_WORKSPACE_STORAGE_KEY_PREFIX = 'cc_course_workspace_v1:';

export function getCourseWorkspaceStorageKey(courseSlug: string): string {
  return `${COURSE_WORKSPACE_STORAGE_KEY_PREFIX}${courseSlug}`;
}
