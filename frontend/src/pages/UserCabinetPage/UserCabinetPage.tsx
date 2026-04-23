import { collectNavLinksFromTree } from '@/app/lib/nav-links';
import { useAppSelector } from '@/app/store';
import { selectIsAdmin } from '@/entities/session';
import { ProtectedRoute } from '@/features/session';
import { Tabs, type Tab } from '@/features/tabs-filter';
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import styles from './UserCabinetPage.module.scss';

export function UserCabinetPage() {
  useEffect(() => {
    document.body.classList.add(styles.styledBody);
    return () => {
      document.body.classList.remove(styles.styledBody);
    };
  }, []);

  const router = useRouter();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const isFullPageCourseRoute =
    pathSegments[0] === 'cabinet' &&
    pathSegments[1] === 'courses' &&
    (pathSegments[2] === 'new' ||
      (Boolean(pathSegments[2]) && pathSegments.length >= 3));

  const isFullPageArticleRoute =
    pathSegments[0] === 'cabinet' &&
    pathSegments[1] === 'articles' &&
    (pathSegments[2] === 'new' ||
      (Boolean(pathSegments[2]) && pathSegments.length >= 3));

  const isFullPageRequestRoute =
    pathSegments[0] === 'cabinet' &&
    pathSegments[1] === 'requests' &&
    (pathSegments[2] === 'new' ||
      (Boolean(pathSegments[2]) && pathSegments.length >= 3));

  const isAdmin = useAppSelector(selectIsAdmin);

  const tabs: Tab[] = useMemo(() => {
    const cabinetRoute = router.routesById['/cabinet'];
    return collectNavLinksFromTree(cabinetRoute, { isAdmin }).map((link) => ({
      id: link.to,
      label: link.label,
      value: link.to,
    }));
  }, [router.routesById, isAdmin]);

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => location.pathname.startsWith(tab.value))?.value ??
      tabs[0]?.value ??
      '',
    [location.pathname, tabs],
  );

  if (isFullPageCourseRoute || isFullPageArticleRoute || isFullPageRequestRoute) {
    return (
      <ProtectedRoute>
        <section className={styles.container}>
          <Outlet />
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className={styles.container}>
        <h2>Личный кабинет</h2>

        <Tabs
          variant="secondary"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(path) => navigate({ to: path })}
          className={styles.tabs}
        />

        <div className={styles.tabContent}>
          <Outlet />
        </div>
      </section>
    </ProtectedRoute>
  );
}
