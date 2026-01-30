import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import styles from './PuppiesSection.module.scss'

const breeds: Tab[] = [
  { uid: 1, label: 'Шпицы', value: 'spitz' },
  { uid: 2, label: 'Шарпеи', value: 'sharpey' },
  { uid: 3, label: 'Сиба-Ину', value: 'sibainu' },
  { uid: 4, label: 'Корги', value: 'corgi' },
]

const getBreedImage = (value: string) => `/${value}.webp`

const puppies = breeds.flatMap((breed, bIdx) =>
  Array.from({ length: 3 }, (_, idx) => ({
    uid: bIdx * 3 + idx + 1,
    name: `Щенок ${idx + 1}`,
    image: getBreedImage(breed.value),
    breed: breed.value,
  }))
)

export function PuppiesSection() {
  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши Щенки</h2>
        <FilterableGallery
          tabs={breeds}
          items={puppies}
          filterBy="breed"
          renderItem={(puppy) => (
            <Card
              imgUrl={puppy.image as string}
              subtitle={puppy.name as string}
            />
          )}
          className={styles.gallery}
        />
        <Button>Смотреть всех</Button>
      </div>
    </section>
  )
}
