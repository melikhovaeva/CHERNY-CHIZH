import { getHeaderLinks, getMobileMenuLinks } from '@/app/lib/nav-links';
import { selectIsAuthenticated, selectSessionStatus } from '@/entities/session';
import { useAppSelector } from '@/shared/lib/store';
import { BurgerMenu, BurgerMenuList, LoginButton } from '@/features';
import { UserMenu } from '@/features/session';
import { cn } from '@/shared/lib/utils';
import { Backdrop, Skeleton } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import styles from './Header.module.scss';

const AVATAR_SIZE = 50;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const headerLinks = useMemo(() => getHeaderLinks(), []);
  const mobileMenuLinks = useMemo(() => getMobileMenuLinks(), []);

  const isAuthUnknown = sessionStatus === 'idle' || sessionStatus === 'loading';

  const renderSkeletonAuthControl = () => (
    <div className={styles.userMenu} aria-hidden>
      <Skeleton
        variant="avatar"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className={styles.avatarSkeleton}
      />
    </div>
  );

  const renderLoginControl = () => <LoginButton />;

  const renderUserControl = () => (
    <div className={styles.userMenu}>
      <UserMenu />
    </div>
  );

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
    <header className={styles.container}>
      {isMenuOpen && (
        <Backdrop onClick={() => setIsMenuOpen(false)} aria-hidden />
      )}
      <div
        className={cn([
          styles.content,
          isMenuOpen ? styles.content_menuOpen : '',
        ])}
      >
        <Link to="/" className={styles.logo}>
          CHERNIY CHIZH
        </Link>
        <ul className={styles.links}>
          {headerLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.burgerWrap}>
          <BurgerMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpen={() => setIsMenuOpen(true)}
          />
        </div>
        <div className={styles.desktopActions}>{authControlDesktop}</div>
      </div>
      <div
        className={cn([
          styles.menuPanel,
          isMenuOpen ? styles.menuPanel_open : '',
        ])}
        aria-hidden={!isMenuOpen}
      >
        <BurgerMenuList
          links={mobileMenuLinks}
          loginButton={authControlMobile}
          onLinkClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
}
