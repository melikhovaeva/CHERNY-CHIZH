import { getLibraryItemsMock, LIBRARY_OPTIONS, type LibraryItemMock } from '@/entities/library'
import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import styles from './LibrarySection.module.scss'

const libraryTabs: Tab[] = LIBRARY_OPTIONS.map((option, index) => ({
  uid: index + 1,
  label: option.label,
  value: option.value,
}))

const libraryItems: LibraryItemMock[] = getLibraryItemsMock()

export function LibrarySection() {
  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>База знаний</h2>
        <FilterableGallery
          tabs={libraryTabs}
          items={libraryItems}
          filterBy="library"
          renderItem={(libraryItem) => (
            <Card
              imgUrl={libraryItem.image}
              title={libraryItem.name}
            />
          )}
          className={styles.gallery}
        />
        <Button>Смотреть все</Button>
      </div>
    </section>
  )
}
