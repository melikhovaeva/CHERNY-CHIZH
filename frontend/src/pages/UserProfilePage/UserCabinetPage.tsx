import { ProtectedRoute } from '@/features/session';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { CabinetCourses, CabinetMyCourses, CabinetSettings } from '@/widgets';
import { useEffect, useState } from 'react';
import { USER_PROFILE_TABS, type UserProfileTabId } from './model/tabs';
import styles from './UserCabinetPage.module.scss';

const profileTabs: Tab[] = USER_PROFILE_TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  value: tab.id,
}));

export function UserCabinetPage() {
  useEffect(() => {
    document.body.classList.add(styles.styledBody);
    return () => {
      document.body.classList.remove(styles.styledBody);
    };
  }, []);
  const [activeTab, setActiveTab] = useState<UserProfileTabId>('my-courses');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'courses':
        return <CabinetCourses />;
      case 'my-courses':
        return <CabinetMyCourses />;
      case 'settings':
        return <CabinetSettings />;
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

