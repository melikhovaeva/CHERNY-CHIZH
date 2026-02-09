import {
  PuppyCard,
  useGetPuppiesQuery,
} from '@/entities/puppy'
import { matchPuppyByFilters } from '@/features'
import { PuppiesEmptyState, type PuppiesFiltersValue } from '@/widgets'
import styles from './PuppiesList.module.scss'

interface PuppiesListProps {
  breedId?: string
  filters?: PuppiesFiltersValue
  className?: string
}

export function PuppiesList({ breedId, filters, className }: PuppiesListProps) {
  const { data: allPuppies, isLoading } = useGetPuppiesQuery()
  const puppies = (allPuppies ?? []).filter((puppy) => {
    if (breedId && puppy.breed.slug !== breedId) return false
    return matchPuppyByFilters(puppy, filters ?? {})
  })

  if (isLoading) return null

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
          <PuppyCard key={puppy.id} puppy={puppy} />
        ))}
      </div>
    </div>
  )
}
