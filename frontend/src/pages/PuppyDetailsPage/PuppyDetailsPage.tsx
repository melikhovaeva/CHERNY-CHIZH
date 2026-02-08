import { PuppyCard, useGetPuppyQuery } from '@/entities/puppy'
import { PuppyTabsSection, RelatedPuppies } from '@/widgets'
import { useParams } from '@tanstack/react-router'
import styles from './PuppyDetailsPage.module.scss'

export function PuppyDetailsPage() {
  const { breedId, puppyId } = useParams({
    from: '/puppies/$breedId/$puppyId',
  })
  const id = Number(puppyId)
  const { data: puppy, isLoading, isError } = useGetPuppyQuery(id, {
    skip: !puppyId || Number.isNaN(id),
  })

  if (isLoading) {
    return (
      <div className={styles.root}>
        <p>Загрузка...</p>
      </div>
    )
  }

  if (isError || !puppy || puppy.breed.slug !== breedId) {
    return (
      <div className={styles.notFound}>
        <p>Щенок не найден.</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{puppy.name}</h1>
      <div className={styles.container}>
        <PuppyCard puppy={puppy} detailed className={styles.details} />
        <PuppyTabsSection puppy={puppy} className={styles.tabs} />
        <RelatedPuppies currentPuppy={puppy} />
      </div>
    </div>
  )
}
