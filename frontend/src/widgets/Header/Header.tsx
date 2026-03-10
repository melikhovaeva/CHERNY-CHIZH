import { getHeaderLinks, getMobileMenuLinks } from '@/app/lib/nav-links';
import { selectIsAuthenticated, selectSessionStatus } from '@/entities/session';
import { LoginButton } from '@/features';
import { UserMenu } from '@/features/session';
import { useAppSelector } from '@/app/store';
import { Skeleton } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import { AppLogo, Header as CommonHeader } from '@/shared/common';
import { useMemo } from 'react';

const AVATAR_SIZE = 50;

export function Header() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const headerLinks = useMemo(() => getHeaderLinks(), []);
  const mobileMenuLinks = useMemo(() => getMobileMenuLinks(), []);

  const isAuthUnknown = sessionStatus === 'idle' || sessionStatus === 'loading';

  const renderSkeletonAuthControl = () => (
    <div aria-hidden>
      <Skeleton variant="avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />
    </div>
  );

  const renderLoginControl = () => <LoginButton />;

  const renderUserControl = () => <UserMenu />;

  const authControlDesktop = isAuthUnknown
    ? renderSkeletonAuthControl()
    : isAuthenticated
      ? renderUserControl()
      : renderLoginControl();

  const authControlMobile = isAuthUnknown
    ? renderSkeletonAuthControl()
    : isAuthenticated
      ? renderUserControl()
      : renderLoginControl();

  return (
    <CommonHeader
      logo={
        <Link to="/">
          <AppLogo aria-label="Logo" />
        </Link>
      }
      links={headerLinks}
      mobileLinks={mobileMenuLinks}
      renderLink={(link, onClick) => (
        <Link to={link.to} onClick={onClick}>
          {link.label}
        </Link>
      )}
      desktopActions={authControlDesktop}
      mobileActions={authControlMobile}
    />
  );
}
