import { getBreedFullName, type BreedValue } from '@/entities/breed'
import { PUPPIES_FAQ_ITEMS } from '@/entities/puppy'
import { Accordion } from '@/shared/ui/components'
import { PuppiesFilters, PuppiesList } from '@/widgets'
import type { PuppiesFiltersValue } from '@/widgets/PuppiesFilters'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import styles from './PuppiesPage.module.scss'

const DEFAULT_FILTERS: PuppiesFiltersValue = {
  gender: 'all',
  potential: 'all',
  status: 'all',
}

export const PuppiesPage = () => {
  const { breedId } = useParams({
    from: '/puppies/$breedId',
  }) as { breedId: BreedValue }
  const [filters, setFilters] = useState<PuppiesFiltersValue>(DEFAULT_FILTERS)

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
          <PuppiesFilters
            className={styles.filters}
            value={filters}
            onChange={setFilters}
          />
          <div className={styles.content}>
            <PuppiesList breedId={breedId} filters={filters} />
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
