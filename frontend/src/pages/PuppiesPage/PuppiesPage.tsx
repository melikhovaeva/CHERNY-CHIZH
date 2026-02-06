import type { BreedValue } from '@/entities/breed'
import { PuppiesList } from '@/widgets'
import { useParams } from '@tanstack/react-router'
import styles from './PuppiesPage.module.scss'

export const PuppiesPage = () => {
  const { breedId } = useParams({
    from: '/puppies/$breedId',
  }) as { breedId: BreedValue }

  return (
    <div className={styles.main}>
      <PuppiesList breedId={breedId} />
    </div>
  )
}
