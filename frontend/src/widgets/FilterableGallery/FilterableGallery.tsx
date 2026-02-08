import { Tabs, type Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { useMemo, useState } from 'react'
import styles from './FilterableGallery.module.scss'

interface FilterableGalleryProps<T extends { id: number | string }> {
  tabs: Tab[]
  items: T[]
  filterBy: keyof T
  renderItem: (item: T) => React.ReactNode
  className?: string
  activeTab?: string
  onActiveTabChange?: (value: string) => void
  getItemKey?: (item: T) => string | number
  getFilterValue?: (item: T) => string
}

export function FilterableGallery<T extends { id: number | string }>({
  tabs,
  items,
  filterBy,
  renderItem,
  className,
  activeTab: controlledActiveTab,
  onActiveTabChange,
  getItemKey,
  getFilterValue,
}: FilterableGalleryProps<T>) {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    tabs[0]?.value ?? '',
  )
  const activeTab = controlledActiveTab ?? internalActiveTab

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const value = getFilterValue ? getFilterValue(item) : String(item[filterBy])
        return value === activeTab
      }),
    [items, filterBy, activeTab, getFilterValue],
  )

  return (
    <div className={cn([styles.gallery, className || ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => {
          if (controlledActiveTab === undefined) setInternalActiveTab(value)
          onActiveTabChange?.(value)
        }}
        className={styles.gallery__tabs}
      />
      <div className={styles.gallery__scroll}>
        <ul className={styles.gallery__list}>
          {filteredItems.map((item) => (
            <li
              key={getItemKey ? getItemKey(item) : item.id}
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
