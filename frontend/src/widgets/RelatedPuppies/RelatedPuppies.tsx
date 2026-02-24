import type { Puppy } from '@/entities/puppy';
import { getFirstPhotoUrl, useGetPuppiesQuery } from '@/entities/puppy';
import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/components';
import { Link } from '@tanstack/react-router';
import styles from './RelatedPuppies.module.scss';

const detailPath = '/puppies/$breedId/$puppyId';

interface RelatedPuppiesProps {
  currentPuppy: Puppy;
  className?: string;
}

const STATUS_AVAILABLE_CODE = 'on_sale';

export function RelatedPuppies({
  currentPuppy,
  className,
}: RelatedPuppiesProps) {
  const { data: allPuppies } = useGetPuppiesQuery();
  const related = (allPuppies ?? []).filter(
    (p) =>
      p.breed.slug === currentPuppy.breed.slug &&
      p.id !== currentPuppy.id &&
      p.status.code === STATUS_AVAILABLE_CODE,
  );

  if (related.length === 0) return null;

  return (
    <section className={cn([styles.root, className || ''])}>
      <h2 className={styles.title}>ДОСТУПНЫЕ ЩЕНКИ</h2>
      <div className={styles.list}>
        {related.map((puppy) => (
          <Link
            key={puppy.id}
            to={detailPath}
            params={{ breedId: puppy.breed.slug, puppyId: String(puppy.id) }}
            className={styles.cardLink}
          >
            <Card title={puppy.name} imgUrl={getFirstPhotoUrl(puppy)} />
          </Link>
        ))}
      </div>
    </section>
  );
}
