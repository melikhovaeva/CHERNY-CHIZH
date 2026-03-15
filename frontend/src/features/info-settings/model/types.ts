export const INFO_SETTINGS_SECTION = {
  INFO: 'info',
  ACTIONS: 'actions',
} as const;

export type InfoSettingsSection =
  (typeof INFO_SETTINGS_SECTION)[keyof typeof INFO_SETTINGS_SECTION];

export const INFO_SETTINGS_SECTION_LABELS = {
  [INFO_SETTINGS_SECTION.INFO]: 'Информация',
  [INFO_SETTINGS_SECTION.ACTIONS]: 'Действия',
} as const;
