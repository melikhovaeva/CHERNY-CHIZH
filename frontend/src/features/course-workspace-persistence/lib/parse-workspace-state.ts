import { INFO_SETTINGS_SECTION } from '@/features/info-settings/model/types';
import {
  COURSE_WORKSPACE_STORAGE_SCHEMA_VERSION,
  COURSE_WORKSPACE_TAB,
  type CourseWorkspaceTab,
} from '../model/config';
import type { CourseWorkspacePersistedV1 } from '../model/types';

const VALID_TABS = new Set<string>(Object.values(COURSE_WORKSPACE_TAB));

const VALID_SETTINGS_SECTIONS = new Set<string>(
  Object.values(INFO_SETTINGS_SECTION),
);

function parseTab(value: unknown): CourseWorkspaceTab | undefined {
  return typeof value === 'string' && VALID_TABS.has(value)
    ? (value as CourseWorkspaceTab)
    : undefined;
}

function parseSettingsSection(
  value: unknown,
): CourseWorkspacePersistedV1['settingsSection'] | undefined {
  return typeof value === 'string' && VALID_SETTINGS_SECTIONS.has(value)
    ? (value as CourseWorkspacePersistedV1['settingsSection'])
    : undefined;
}

export const COURSE_WORKSPACE_DEFAULT_STATE: CourseWorkspacePersistedV1 = {
  v: COURSE_WORKSPACE_STORAGE_SCHEMA_VERSION,
  tab: COURSE_WORKSPACE_TAB.SETTINGS,
  settingsSection: INFO_SETTINGS_SECTION.INFO,
  stepServerId: null,
  lessonServerId: null,
  taskId: null,
};

export function parseStoredWorkspaceState(
  raw: string | null,
): CourseWorkspacePersistedV1 {
  if (raw == null || raw === '') {
    return { ...COURSE_WORKSPACE_DEFAULT_STATE };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...COURSE_WORKSPACE_DEFAULT_STATE };
    }
    const o = parsed as Record<string, unknown>;
    return {
      v: COURSE_WORKSPACE_STORAGE_SCHEMA_VERSION,
      tab: parseTab(o.tab) ?? COURSE_WORKSPACE_DEFAULT_STATE.tab,
      settingsSection:
        parseSettingsSection(o.settingsSection) ??
        COURSE_WORKSPACE_DEFAULT_STATE.settingsSection,
      stepServerId:
        typeof o.stepServerId === 'number' && Number.isFinite(o.stepServerId)
          ? o.stepServerId
          : null,
      lessonServerId:
        typeof o.lessonServerId === 'number' &&
        Number.isFinite(o.lessonServerId)
          ? o.lessonServerId
          : null,
      taskId: typeof o.taskId === 'string' ? o.taskId : null,
    };
  } catch {
    return { ...COURSE_WORKSPACE_DEFAULT_STATE };
  }
}
