import { getHeaderLinks, getMobileMenuLinks } from '@/app/lib/nav-links';
import { Link, useNavigate } from '@tanstack/react-router';
import { AppLogo, Header as CommonHeader, UserDropdownMenu } from 'common';
import { useMemo } from 'react';
import styles from './Header.module.scss';

export function Header() {
  const navigate = useNavigate();
  const headerLinks = useMemo(() => getHeaderLinks(), []);
  const mobileMenuLinks = useMemo(() => getMobileMenuLinks(), []);
  const goToUserApp = () => {
    window.location.assign('/');
  };

  return (
    <CommonHeader
      logo={
        <div className={styles.logo}>
          <AppLogo onClick={goToUserApp} aria-label="Logo" />
        </div>
      }
      links={headerLinks}
      mobileLinks={mobileMenuLinks}
      renderLink={(link, onClick) => (
        <Link to={link.to} onClick={onClick}>
          {link.label}
        </Link>
      )}
      desktopActions={
        <UserDropdownMenu
          avatarAlt="CRM user"
          avatarFallbackText="C"
          items={[
            {
              id: 'dashboard',
              label: 'Дашборд',
              onClick: () => navigate({ to: '/' }),
            },
          ]}
        />
      }
      mobileActions={
        <UserDropdownMenu
          avatarAlt="CRM user"
          avatarFallbackText="C"
          items={[
            {
              id: 'dashboard-mobile',
              label: 'Дашборд',
              onClick: () => navigate({ to: '/' }),
            },
          ]}
        />
      }
    />
  );
}
