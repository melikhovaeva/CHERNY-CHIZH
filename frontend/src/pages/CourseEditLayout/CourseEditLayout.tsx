import { Tabs, type Tab } from '@/features/tabs-filter';
import { Outlet, useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import styles from './CourseEditLayout.module.scss';

const COURSE_EDIT_TABS: Tab[] = [
  { id: 'preview', label: 'Предпросмотр', value: 'preview' },
  { id: 'constructor', label: 'Конструктор', value: 'constructor' },
  { id: 'settings', label: 'Настройки', value: 'settings' },
];

export const CourseEditLayout = () => {
  const { courseSlug } = useParams({ strict: false });
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/cabinet/courses/${courseSlug}`;

  const activeTab = useMemo(() => {
    const segments = location.pathname.replace(basePath, '').split('/').filter(Boolean);
    return segments[0] || 'settings';
  }, [location.pathname, basePath]);

  const handleTabChange = (tab: string) => {
    navigate({ to: `${basePath}/${tab}` });
  };

  return (
    <div className={styles.root}>
      <Tabs
        tabs={COURSE_EDIT_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="secondary"
        className={styles.tabs}
      />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
