import { Link } from '@tanstack/react-router'
import styles from './Header.module.scss'

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
]

export function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
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
        <button className={styles.button}><i></i><span>Войти</span></button>
      </div>
    </div>
  )
}
