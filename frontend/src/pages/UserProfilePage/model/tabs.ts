export type UserProfileTabId = 'courses' | 'my-courses' | 'settings';

export const USER_PROFILE_TABS: { id: UserProfileTabId; label: string }[] = [
  { id: 'courses', label: 'Курсы' },
  { id: 'my-courses', label: 'Мои курсы' },
  { id: 'settings', label: 'Настройки' },
];
