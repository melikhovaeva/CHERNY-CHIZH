import {
  getPuppiesMock,
  matchPuppyByFilters,
  PuppyCard,
} from '@/entities/puppy'
import type { BreedValue } from '@/entities/breed'
import { PuppiesEmptyState, type PuppiesFiltersValue } from '@/widgets'
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

  if (puppies.length === 0) {
    return (
      <div className={className}>
        <PuppiesEmptyState />
      </div>
    )
  }

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
