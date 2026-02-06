import { getBreedFullName, type BreedValue } from '@/entities/breed'
import { PUPPIES_FAQ_ITEMS } from '@/entities/puppy/model/mocks'
import { Accordion } from '@/shared/ui/components'
import { PuppiesList } from '@/widgets'
import { useParams } from '@tanstack/react-router'
import styles from './PuppiesPage.module.scss'

export const PuppiesPage = () => {
  const { breedId } = useParams({
    from: '/puppies/$breedId',
  }) as { breedId: BreedValue }

  return (
    <div className={styles.main}>
      <section className={styles.catalogSection}>
        <div className={styles.titleContainer}>
          <h2>Щенки
            <span className={styles.breedName}> {getBreedFullName(breedId)}</span>
          </h2>
          <p className={styles.breedDescription}>Привиты по возрасту, с клеймом, ветеринарным паспортом и документами РКФ. Возможна установка микрочипа</p>
        </div>
        <div className={styles.catalogContainer}>
          <div className={styles.content}>
            <PuppiesList breedId={breedId} />
          </div>
        </div>
      </section>
      <section className={styles.deliverySection}>
        <div className={styles.deliveryContainer}>
          <h2 className={styles.deliveryTitle}>Доставка в любую точку</h2>
          <Accordion items={PUPPIES_FAQ_ITEMS} />
        </div>
      </section>
    </div>
  )
}
