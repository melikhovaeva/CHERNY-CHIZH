import { useAppSelector } from '@/app/store';
import { getHeaderLinks, getMobileMenuLinks } from '@/app/lib/nav-links';
import { selectIsAuthenticated, selectSessionStatus } from '@/entities/session';
import { LoginButton } from '@/features';
import { UserMenu } from '@/features/session';
import { AppLogo, Skeleton } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import styles from './Header.module.scss';

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.container}>
      {isMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className={styles.backdrop}
          onClick={closeMenu}
        />
      ) : null}

      <div className={`${styles.content} ${isMenuOpen ? styles.content_menuOpen : ''}`}>
        <div className={styles.logo}>
          <Link to="/">
            <AppLogo aria-label="Logo" />
          </Link>
        </div>

        <ul className={styles.links}>
          {headerLinks.map((link) => (
            <li key={link.to}>
              <div className={styles.link}>
                <Link to={link.to}>{link.label}</Link>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.burgerWrap}>
          <button
            type="button"
            className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ''}`}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={styles.desktopActions}>{authControlDesktop}</div>
      </div>

      <div className={`${styles.menuPanel} ${isMenuOpen ? styles.menuPanel_open : ''}`}>
        <nav className={styles.mobileNav} aria-hidden={!isMenuOpen}>
          <ul className={styles.mobileLinks}>
            {mobileMenuLinks.map((link) => (
              <li key={link.to}>
                <div className={styles.mobileLink}>
                  <Link to={link.to} onClick={closeMenu}>
                    {link.label}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>{authControlMobile}</div>
        </nav>
      </div>
    </header>
  );
}
