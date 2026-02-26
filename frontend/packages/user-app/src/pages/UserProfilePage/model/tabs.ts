export type UserProfileTabId = 'my-courses' | 'settings';

export const USER_PROFILE_TABS: { id: UserProfileTabId; label: string }[] = [
  { id: 'my-courses', label: 'Мои курсы' },
  { id: 'settings', label: 'Настройки' },
];
