import type { Tab } from '@/features/tabs-filter'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import styles from './HomePage.module.scss'

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

export function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.hero__textContainer}>
          <h1 className={styles.hero__title}>Чемпионы ринга и верные друзья</h1>
          <p className={styles.hero__description}>Наши собаки уверенно чувствуют себя на ринге и остаются надёжными компаньонами дома</p>
        </div>
        <ul className={styles.hero__list}>
          {Array.from({ length: 4 }).map((_, index) => (
            <li className={styles.hero__list__item} key={index}>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${styles.puppies} filled primary`}>
        <div className={styles.puppies__container}>
          <h2 className={styles.puppies__title}>Наши Щенки</h2>
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
            className={styles.puppies__gallery}
          />
          <Button>Смотреть всех</Button>
        </div>
      </section>
    </main>
  )
}