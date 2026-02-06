import { getPuppiesMock, PuppyCard } from '@/entities/puppy'
import type { BreedValue } from '@/entities/breed'
import styles from './PuppiesList.module.scss'

interface PuppiesListProps {
  breedId?: BreedValue
  className?: string
}

export function PuppiesList({ breedId, className }: PuppiesListProps) {
  const puppies = getPuppiesMock().filter(
    (puppy) => !breedId || puppy.breed === breedId,
  )

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
