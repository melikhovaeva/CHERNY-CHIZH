import {
  getPuppiesMock,
  matchPuppyByFilters,
  PuppyCard,
} from '@/entities/puppy'
import type { BreedValue } from '@/entities/breed'
import type { PuppiesFiltersValue } from '@/widgets/PuppiesFilters'
import styles from './PuppiesList.module.scss'

interface PuppiesListProps {
  breedId?: BreedValue
  filters?: PuppiesFiltersValue
  className?: string
}

export function PuppiesList({ breedId, filters, className }: PuppiesListProps) {
  const puppies = getPuppiesMock().filter((puppy) => {
    if (breedId && puppy.breed !== breedId) return false
    return matchPuppyByFilters(puppy, filters ?? {})
  })

  return (
    <div className={className}>
      <div className={styles.list}>
        {puppies.map((puppy) => (
          <PuppyCard key={puppy.uid} puppy={puppy} />
        ))}
      </div>
    </div>
  )
}
