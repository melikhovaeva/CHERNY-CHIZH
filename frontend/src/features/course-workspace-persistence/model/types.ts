import type { InfoSettingsSection } from '@/features/info-settings';
import type { CourseWorkspaceTab } from './config';

export type CourseWorkspacePersistedV1 = {
  v: number;
  tab: CourseWorkspaceTab;
  settingsSection: InfoSettingsSection;
  stepServerId: number | null;
  lessonServerId: number | null;
  taskId: string | null;
};
