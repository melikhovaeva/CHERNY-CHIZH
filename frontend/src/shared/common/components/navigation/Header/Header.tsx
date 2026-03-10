import { type ReactNode, useEffect, useState } from "react";
import type { NavLink } from "../../../lib/nav-links";
import styles from "./Header.module.scss";

export interface HeaderProps {
  logo: ReactNode;
  links: NavLink[];
  mobileLinks: NavLink[];
  renderLink: (link: NavLink, onClick?: () => void) => ReactNode;
  desktopActions?: ReactNode;
  mobileActions?: ReactNode;
}

export function Header({
  logo,
  links,
  mobileLinks,
  renderLink,
  desktopActions,
  mobileActions,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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

      <div className={`${styles.content} ${isMenuOpen ? styles.content_menuOpen : ""}`}>
        <div className={styles.logo}>{logo}</div>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.to}>
              <div className={styles.link}>{renderLink(link)}</div>
            </li>
          ))}
        </ul>

        <div className={styles.burgerWrap}>
          <button
            type="button"
            className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ""}`}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={styles.desktopActions}>{desktopActions}</div>
      </div>

      <div className={`${styles.menuPanel} ${isMenuOpen ? styles.menuPanel_open : ""}`}>
        <nav className={styles.mobileNav} aria-hidden={!isMenuOpen}>
          <ul className={styles.mobileLinks}>
            {mobileLinks.map((link) => (
              <li key={link.to}>
                <div className={styles.mobileLink}>{renderLink(link, closeMenu)}</div>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>{mobileActions}</div>
        </nav>
      </div>
    </header>
  );
}
