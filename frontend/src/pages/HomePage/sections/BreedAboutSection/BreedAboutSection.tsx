import {
  BREED_OPTIONS,
  breedDescriptionsMock,
  getBreedImageUrl,
} from '@/entities/breed'
import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import { BreedAbout } from '@/widgets'
import styles from './BreedAboutSection.module.scss'

const breedTabs: Tab[] = BREED_OPTIONS.map((option, index) => ({
  uid: index + 1,
  label: option.label,
  value: option.value,
}))

export function BreedAboutSection() {
  return (
    <section className={cn([styles.root, 'filled secondary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>О породе</h2>
        <BreedAbout
          tabs={breedTabs}
          descriptions={breedDescriptionsMock}
          getImageUrl={getBreedImageUrl}
        />
        <Button>Подробнее</Button>
      </div>
    </section>
  )
}
