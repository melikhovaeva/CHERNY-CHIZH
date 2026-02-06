import { getPuppiesMock } from '@/entities/breed'
import type { BreedValue } from '@/entities/breed'
import { Card } from '@/shared/ui/components'
import { useParams } from '@tanstack/react-router'
import styles from './PuppiesPage.module.scss'

export const PuppiesPage = () => {
  const { breedId } = useParams({
    from: '/puppies/$breedId',
  }) as { breedId: BreedValue }

  const puppies = getPuppiesMock().filter(
    (puppy) => puppy.breed === breedId,
  )

  return (
    <div className={styles.main}>
      <div className={styles.list}>
        {puppies.map((puppy) => (
          <Card
            key={puppy.uid}
            imgUrl={puppy.image}
            subtitle={puppy.name}
          />
        ))}
      </div>
    </div>
  )
}
