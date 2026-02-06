import { Link, useLocation } from '@tanstack/react-router'
import { getSegmentLabel } from './breadcrumb-config'
import styles from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
  path: string
  label: string
  isLast: boolean
}

function buildBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return [{ path: '/', label: 'Главная', isLast: true }]
  }

  const items: BreadcrumbItem[] = segments.map((segment, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/')
    return {
      path,
      label: getSegmentLabel(segment),
      isLast: i === segments.length - 1,
    }
  })

  return [{ path: '/', label: 'Главная', isLast: false }, ...items]
}

export const Breadcrumb = () => {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const items = buildBreadcrumbItems(pathname)

  return (
    <nav className={styles.breadcrumb} aria-label="Хлебные крошки">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.path} className={styles.item}>
            {index > 0 && <span className={styles.separator}> &gt; </span>}
            {item.isLast ? (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
