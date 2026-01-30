import { BREED_OPTIONS, getPuppiesMock } from '@/entities/breed'
import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import styles from './PuppiesSection.module.scss'

const breedTabs: Tab[] = BREED_OPTIONS.map((option, index) => ({
  uid: index + 1,
  label: option.label,
  value: option.value,
}))

const puppies = getPuppiesMock()

export function PuppiesSection() {
  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши Щенки</h2>
        <FilterableGallery
          tabs={breedTabs}
          items={puppies}
          filterBy="breed"
          renderItem={(puppy) => (
            <Card
              imgUrl={puppy.image}
              subtitle={puppy.name}
            />
          )}
          className={styles.gallery}
        />
        <Button>Смотреть всех</Button>
      </div>
    </section>
  )
}
