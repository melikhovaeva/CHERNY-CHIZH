import { Link, useLocation } from '@tanstack/react-router'
import { getSegmentLabelStatic } from './breadcrumb-config'
import styles from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
  path: string
  label: string
  isLast: boolean
}

export interface BreadcrumbProps {
  getSegmentLabel?: (segment: string, pathname?: string) => string
}

function buildBreadcrumbItems(
  pathname: string,
  getSegmentLabel: (segment: string, pathname?: string) => string,
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return [{ path: '/', label: 'Главная', isLast: true }]
  }

  const items: BreadcrumbItem[] = segments.map((segment, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/')
    return {
      path,
      label: getSegmentLabel(segment, pathname),
      isLast: i === segments.length - 1,
    }
  })

  return [{ path: '/', label: 'Главная', isLast: false }, ...items]
}

export const Breadcrumb = ({ getSegmentLabel }: BreadcrumbProps) => {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const resolveLabel =
    getSegmentLabel ?? ((segment: string) => getSegmentLabelStatic(segment))
  const items = buildBreadcrumbItems(pathname, resolveLabel)

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
