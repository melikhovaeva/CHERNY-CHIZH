import type { BreedValue } from '@/entities/breed'
import { getPuppiesMock } from '@/entities/puppy'
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
          <div key={puppy.uid}>
            {puppy.name}
            {puppy.image}
            {puppy.breed}
            {puppy.status.name}
            {puppy.birthDate.toLocaleDateString()}
            {puppy.sex.name}
            {puppy.color}
            {puppy.documents.map((document) => document.name)}
            {puppy.parents.map((parent) => parent.name)}
          </div>
        ))}
      </div>
    </div>
  )
}
