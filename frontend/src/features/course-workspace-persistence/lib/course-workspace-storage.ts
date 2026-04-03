import { getCourseWorkspaceStorageKey } from '../model/config';
import type { CourseWorkspacePersistedV1 } from '../model/types';
import {
  COURSE_WORKSPACE_DEFAULT_STATE,
  parseStoredWorkspaceState,
} from './parse-workspace-state';

export function loadCourseWorkspaceState(
  courseSlug: string,
): CourseWorkspacePersistedV1 {
  if (typeof window === 'undefined' || !courseSlug) {
    return { ...COURSE_WORKSPACE_DEFAULT_STATE };
  }
  try {
    const raw = window.sessionStorage.getItem(
      getCourseWorkspaceStorageKey(courseSlug),
    );
    return parseStoredWorkspaceState(raw);
  } catch {
    return { ...COURSE_WORKSPACE_DEFAULT_STATE };
  }
}

export function mergeCourseWorkspaceState(
  courseSlug: string,
  partial: Partial<CourseWorkspacePersistedV1>,
): void {
  if (typeof window === 'undefined' || !courseSlug) return;
  try {
    const key = getCourseWorkspaceStorageKey(courseSlug);
    const prev = parseStoredWorkspaceState(window.sessionStorage.getItem(key));
    const next: CourseWorkspacePersistedV1 = { ...prev, ...partial };
    window.sessionStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

export function getInitialCourseWorkspaceTab(
  courseSlug: string | undefined,
  isEdit: boolean,
): CourseWorkspacePersistedV1['tab'] {
  if (!isEdit || !courseSlug) {
    return COURSE_WORKSPACE_DEFAULT_STATE.tab;
  }
  return loadCourseWorkspaceState(courseSlug).tab;
}
