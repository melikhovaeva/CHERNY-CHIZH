import { getPuppiesMock, getPuppyMainPhotoUrl } from '@/entities/puppy'
import type { Puppy } from '@/entities/puppy'
import { Card } from '@/shared/ui/components'
import { cn } from '@/shared/lib/utils'
import { Link } from '@tanstack/react-router'
import styles from './RelatedPuppies.module.scss'

const detailPath = '/puppies/$breedId/$puppyId'

interface RelatedPuppiesProps {
  currentPuppy: Puppy
  className?: string
}

const STATUS_AVAILABLE = 'В продаже'

export function RelatedPuppies({ currentPuppy, className }: RelatedPuppiesProps) {
  const related = getPuppiesMock().filter(
    (p) =>
      p.breed === currentPuppy.breed &&
      p.uid !== currentPuppy.uid &&
      p.status.name === STATUS_AVAILABLE
  )

  if (related.length === 0) return null

  return (
    <section className={cn([styles.root, className || ''])}>
      <h2 className={styles.title}>ДОСТУПНЫЕ ЩЕНКИ</h2>
      <div className={styles.list}>
        {related.map((puppy) => (
          <Link
            key={puppy.uid}
            to={detailPath}
            params={{ breedId: puppy.breed, puppyId: String(puppy.uid) }}
            className={styles.cardLink}
          >
            <Card
              title={puppy.name}
              subtitle={puppy.internationalName}
              imgUrl={getPuppyMainPhotoUrl(puppy)}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
