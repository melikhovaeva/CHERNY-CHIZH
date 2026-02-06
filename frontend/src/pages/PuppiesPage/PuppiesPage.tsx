import { BREED_OPTIONS, getBreedFullName, type BreedValue } from '@/entities/breed'
import { PUPPIES_FAQ_ITEMS } from '@/entities/puppy'
import type { Tab } from '@/features/tabs-filter'
import { Tabs } from '@/features/tabs-filter'
import { Accordion } from '@/shared/ui/components'
import { PuppiesFilters, PuppiesList, type PuppiesFiltersValue } from '@/widgets'
import { useParams, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import styles from './PuppiesPage.module.scss'

const breedTabs: Tab[] = BREED_OPTIONS.map((option, index) => ({
  uid: index + 1,
  label: option.label,
  value: option.value,
}))

const DEFAULT_FILTERS: PuppiesFiltersValue = {
  gender: 'all',
  potential: 'all',
  status: 'all',
}

export const PuppiesPage = () => {
  const router = useRouter()
  const { breedId } = useParams({
    from: '/puppies/$breedId',
  }) as { breedId: BreedValue }
  const [filters, setFilters] = useState<PuppiesFiltersValue>(DEFAULT_FILTERS)

  const handleBreedTabChange = (value: string) => {
    router.navigate({ to: '/puppies/$breedId', params: { breedId: value as BreedValue } })
  }

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
          <Tabs
            tabs={breedTabs}
            activeTab={breedId}
            onTabChange={handleBreedTabChange}
            className={styles.breedTabs}
          />
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
