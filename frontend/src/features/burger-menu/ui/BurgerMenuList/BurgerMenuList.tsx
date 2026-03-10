import { Link } from '@tanstack/react-router'
import type { BurgerMenuLink } from '../BurgerMenu'
import styles from './BurgerMenuList.module.scss'

interface BurgerMenuListProps {
  links: BurgerMenuLink[]
  loginButton: React.ReactNode
  onLinkClick?: () => void
}

export function BurgerMenuList({
  links,
  loginButton,
  onLinkClick,
}: BurgerMenuListProps) {
  return (
    <nav className={styles.nav}>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.to} className={styles.links__item}>
            <Link
              to={link.to}
              className={styles.links__link}
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.login}>{loginButton}</div>
    </nav>
  )
}
