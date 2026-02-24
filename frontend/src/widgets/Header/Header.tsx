import {
  selectIsAuthenticated,
  selectSessionStatus,
  useAppSelector,
} from '@/app/redux';
import { BurgerMenu, BurgerMenuList, LoginButton } from '@/features';
import { UserImage } from '@/features/session';
import { LogoutButton } from '@/features/session/logout/ui/LogoutButton';
import { cn } from '@/shared/lib/utils';
import { Backdrop, Skeleton } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './Header.module.scss';

const headerLinks = [
  {
    to: '/puppies',
    label: 'Щенки',
  },
  {
    to: '/about',
    label: 'О нас',
  },
  {
    to: '/library',
    label: 'База знаний',
  },
  {
    to: '/contacts',
    label: 'Контакты',
  },
];

const mobileMenuLinks = [{ to: '/', label: 'Главная' }, ...headerLinks];

const AVATAR_SIZE = 50;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionStatus = useAppSelector(selectSessionStatus);

  const isAuthUnknown = sessionStatus === 'idle' || sessionStatus === 'loading';

  const authControl = isAuthUnknown ? (
    <div className={styles.userMenu} aria-hidden>
      <Skeleton
        variant="avatar"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className={styles.avatarSkeleton}
      />
    </div>
  ) : isAuthenticated ? (
    <div className={styles.userMenu}>
      <LogoutButton />
      <UserImage size={AVATAR_SIZE} />
    </div>
  ) : (
    <LoginButton />
  );
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
        <div className={styles.desktopActions}>{authControl}</div>
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
          loginButton={authControl}
          onLinkClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
}
