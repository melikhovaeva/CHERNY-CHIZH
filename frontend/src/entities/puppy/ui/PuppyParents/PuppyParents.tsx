import type { Puppy } from '../../model/types';
import { useGetPuppyQuery } from '../../api/puppy.api';
import { PuppyCard, PuppyCardSkeleton } from '../PuppyCard';
import styles from './PuppyParents.module.scss';

interface PuppyParentsProps {
  puppy: Puppy;
  className?: string;
}

export const PuppyParents = ({ puppy, className }: PuppyParentsProps) => {
  const motherId = puppy.parents?.mother?.id
    ? Number(puppy.parents.mother.id)
    : undefined;
  const fatherId = puppy.parents?.father?.id
    ? Number(puppy.parents.father.id)
    : undefined;

  const {
    data: mother,
    isLoading: isMotherLoading,
    isError: isMotherError,
  } = useGetPuppyQuery(motherId as number, {
    skip: !motherId,
  });

  const {
    data: father,
    isLoading: isFatherLoading,
    isError: isFatherError,
  } = useGetPuppyQuery(fatherId as number, {
    skip: !fatherId,
  });

  return (
    <div className={[styles.list, className].filter(Boolean).join(' ')}>
      {(isMotherLoading || mother) && !isMotherError && (
        <div className={styles.item}>
          {mother ? (
            <PuppyCard
              puppy={mother}
              showBookingButton={false}
              detailPathPrefix="dogs"
            />
          ) : (
            <PuppyCardSkeleton />
          )}
        </div>
      )}

      {(isFatherLoading || father) && !isFatherError && (
        <div className={styles.item}>
          {father ? (
            <PuppyCard
              puppy={father}
              showBookingButton={false}
              detailPathPrefix="dogs"
            />
          ) : (
            <PuppyCardSkeleton />
          )}
        </div>
      )}
    </div>
  );
};
