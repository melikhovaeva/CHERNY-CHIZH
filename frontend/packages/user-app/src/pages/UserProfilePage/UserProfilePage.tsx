import { useGetMyCoursesQuery } from '@/entities/course';
import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateProfileMutation,
} from '@/entities/session';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { API_CONFIG } from '@/shared/config/api';
import { ProtectedRoute } from '@/shared/ui/components';
import { ProfileMyCourses, ProfileSettings } from '@/widgets';
import { useState } from 'react';
import { USER_PROFILE_TABS, type UserProfileTabId } from './model/tabs';
import styles from './UserProfilePage.module.scss';

const profileTabs: Tab[] = USER_PROFILE_TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  value: tab.id,
}));
export function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<UserProfileTabId>('my-courses');

  const { data: user, isLoading: isUserLoading, refetch } = useMeQuery();
  const { data: myCourses, isLoading: isMyCoursesLoading } =
    useGetMyCoursesQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
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
        setAvatarError('Не удалось обновить аватар');
        return;
      }

      await refetch();
    } catch {
      setAvatarError('Не удалось обновить аватар');
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
              avatarError={avatarError}
              onAvatarChange={handleAvatarFileChange}
              onUpdateProfile={async (
                payload: Parameters<typeof updateProfile>[0],
              ) => {
                await updateProfile(payload).unwrap();
              }}
              isChangingPassword={isChangingPassword}
              onChangePassword={async (
                payload: Parameters<typeof changePassword>[0],
              ) => {
                await changePassword(payload).unwrap();
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
        <h2>Профиль</h2>

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
