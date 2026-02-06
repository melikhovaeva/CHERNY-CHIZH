import { Tabs, type Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { useMemo, useState } from 'react'
import styles from './FilterableGallery.module.scss'

interface FilterableGalleryProps<T extends { uid: number | string }> {
  tabs: Tab[]
  items: T[]
  filterBy: keyof T
  renderItem: (item: T) => React.ReactNode
  className?: string
  onActiveTabChange?: (value: string) => void
  getItemKey?: (item: T) => string | number
}

export function FilterableGallery<T extends { uid: number | string }>({
  tabs,
  items,
  filterBy,
  renderItem,
  className,
  onActiveTabChange,
  getItemKey,
}: FilterableGalleryProps<T>) {
  const [activeTab, setActiveTab] = useState<string>(
    tabs[0]?.value ?? '',
  )

  const filteredItems = useMemo(
    () =>
      items.filter((item) => String(item[filterBy]) === activeTab),
    [items, filterBy, activeTab],
  )

  return (
    <div className={cn([styles.gallery, className || ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => {
          setActiveTab(value)
          onActiveTabChange?.(value)
        }}
        className={styles.gallery__tabs}
      />
      <div className={styles.gallery__scroll}>
        <ul className={styles.gallery__list}>
          {filteredItems.map((item) => (
            <li
              key={getItemKey ? getItemKey(item) : item.uid}
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
