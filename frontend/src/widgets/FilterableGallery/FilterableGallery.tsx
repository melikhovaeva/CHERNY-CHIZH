import { Tabs, type Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { useMemo, useState } from 'react'
import styles from './FilterableGallery.module.scss'

interface FilterableGalleryProps<T extends Record<string, unknown>> {
  tabs: Tab[]
  items: T[]
  filterBy: string
  renderItem: (item: T) => React.ReactNode
  className?: string
}

export function FilterableGallery<T extends Record<string, unknown>>({
  tabs,
  items,
  filterBy,
  renderItem,
  className,
}: FilterableGalleryProps<T>) {
  const [activeTab, setActiveTab] = useState<string>(
    tabs[0]?.value ?? '',
  )

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) => (item[filterBy] as string) === activeTab,
      ),
    [items, filterBy, activeTab],
  )

  return (
    <div className={cn([styles.gallery, className || ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={styles.gallery__tabs}
      />
      <div className={styles.gallery__scroll}>
        <ul className={styles.gallery__list}>
          {filteredItems.map((item, index) => (
            <li
              key={(item.uid as string | number) ?? index}
              className={styles.gallery__list__item}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
