import { useGetMyCoursesQuery } from '@/entities/course';
import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateProfileMutation,
} from '@/entities/session';
import { ProtectedRoute } from '@/features/session';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { API_CONFIG } from '@/shared/config/api';
import { getFirstApiErrorMessage } from '@/shared';
import { useError, useSuccess } from '@/shared/ui/components';
import { useState } from 'react';
import { ProfileMyCourses, ProfileSettings } from '@/widgets';
import { USER_PROFILE_TABS, type UserProfileTabId } from './model/tabs';
import styles from './UserProfilePage.module.scss';

const profileTabs: Tab[] = USER_PROFILE_TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  value: tab.id,
}));
const PROFILE_ERROR_FIELDS = ['email', 'first_name', 'last_name', 'detail'];
const PASSWORD_ERROR_FIELDS = [
  'old_password',
  'new_password',
  'new_password2',
  'detail',
];

export function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<UserProfileTabId>('my-courses');
  const addError = useError();
  const addSuccess = useSuccess();

  const { data: user, isLoading: isUserLoading, refetch } = useMeQuery();
  const { data: myCourses, isLoading: isMyCoursesLoading } =
    useGetMyCoursesQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar_image', file);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`,
        {
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        },
      );

      if (!response.ok) {
        addError('Не удалось обновить аватар');
        return;
      }

      await refetch();
      addSuccess('Аватар обновлён');
    } catch {
      addError('Не удалось обновить аватар');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'my-courses':
        return (
          <ProfileMyCourses
            myCourses={myCourses ?? null}
            isLoading={isMyCoursesLoading}
          />
        );
      case 'settings':
        return (
          user && (
            <ProfileSettings
              user={user}
              isLoading={isUserLoading}
              isUploadingAvatar={isUploadingAvatar}
              onAvatarChange={handleAvatarFileChange}
              onUpdateProfile={async (
                payload: Parameters<typeof updateProfile>[0],
              ) => {
                try {
                  await updateProfile(payload).unwrap();
                  addSuccess('Профиль обновлён');
                } catch (err) {
                  const message =
                    getFirstApiErrorMessage(err, PROFILE_ERROR_FIELDS) ??
                    'Не удалось обновить профиль';
                  addError(message);
                  throw err;
                }
              }}
              isChangingPassword={isChangingPassword}
              onChangePassword={async (
                payload: Parameters<typeof changePassword>[0],
              ) => {
                try {
                  await changePassword(payload).unwrap();
                  addSuccess('Пароль изменён');
                } catch (err) {
                  const message =
                    getFirstApiErrorMessage(err, PASSWORD_ERROR_FIELDS) ??
                    'Не удалось изменить пароль';
                  addError(message);
                  throw err;
                }
              }}
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <section className={styles.container}>
        <h2>Личный кабинет</h2>

        <Tabs
          variant="secondary"
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as UserProfileTabId)}
          className={styles.tabs}
        />

        <div className={styles.tabContent}>{renderActiveTab()}</div>
      </section>
    </ProtectedRoute>
  );
}
