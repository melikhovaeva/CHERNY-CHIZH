export {
  COURSE_WORKSPACE_TAB,
  COURSE_WORKSPACE_STORAGE_SCHEMA_VERSION,
  getCourseWorkspaceStorageKey,
  type CourseWorkspaceTab,
} from './model/config';
export type { CourseWorkspacePersistedV1 } from './model/types';
export {
  getInitialCourseWorkspaceTab,
  loadCourseWorkspaceState,
  mergeCourseWorkspaceState,
} from './lib/course-workspace-storage';
export { resolveTreeSelection } from './lib/resolve-tree-selection';
export { buildTreePayloadFromLocalSelection } from './lib/tree-selection-from-local';
