import { Tabs, type Tab } from '@/features/tabs-filter';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/components/Skeleton/Skeleton';
import { useMemo, useState } from 'react';
import styles from './FilterableGallery.module.scss';

interface FilterableGalleryProps<T extends { id: number | string }> {
  tabs: Tab[];
  items: T[];
  filterBy: keyof T;
  renderItem: (item: T) => React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  activeTab?: string;
  onActiveTabChange?: (value: string) => void;
  getItemKey?: (item: T) => string | number;
  getFilterValue?: (item: T) => string;
  isLoading?: boolean;
}

export function FilterableGallery<T extends { id: number | string }>({
  tabs,
  items,
  filterBy,
  renderItem,
  fallback,
  className,
  activeTab: controlledActiveTab,
  onActiveTabChange,
  getItemKey,
  getFilterValue,
  isLoading = false,
}: FilterableGalleryProps<T>) {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    tabs[0]?.value ?? '',
  );
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const value = getFilterValue
          ? getFilterValue(item)
          : String(item[filterBy]);
        return value === activeTab;
      }),
    [items, filterBy, activeTab, getFilterValue],
  );

  return (
    <div className={cn([styles.gallery, className || ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => {
          if (controlledActiveTab === undefined) setInternalActiveTab(value);
          onActiveTabChange?.(value);
        }}
        className={styles.gallery__tabs}
      />
      <div className={styles.gallery__scroll}>
        <ul className={styles.gallery__list}>
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={styles.skeletonCard}
                  height={385}
                  width={385}
                />
              ))}
            </>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <li
                    key={getItemKey ? getItemKey(item) : item.id}
                    className={styles.gallery__list__item}
                  >
                    {renderItem(item)}
                  </li>
                ))
              ) : fallback ? (
                <li className={styles.gallery__list__item}>{fallback}</li>
              ) : null}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
