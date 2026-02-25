import {
  PuppyCard,
  useGetDogsByBreedQuery,
} from '@/entities/puppy';
import { matchPuppyByFilters, type PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import { DogsEmptyState } from '../DogsEmptyState';
import styles from './DogsList.module.scss';

interface DogsListProps {
  breedId?: string;
  filters?: PuppyFilters;
  className?: string;
}

export function DogsList({ breedId, filters, className }: DogsListProps) {
  const { data: dogs, isLoading } = useGetDogsByBreedQuery(breedId || '', {
    skip: !breedId,
  });
  const filteredDogs = (dogs ?? []).filter((dog) =>
    matchPuppyByFilters(dog, filters ?? PUPPY_FILTERS_DEFAULTS),
  );

  if (isLoading) return null;

  if (filteredDogs.length === 0) {
    return (
      <div className={className}>
        <DogsEmptyState />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.list}>
        {filteredDogs.map((dog) => (
          <PuppyCard
            key={dog.id}
            puppy={dog}
            showBookingButton={false}
            detailPathPrefix="dogs"
          />
        ))}
      </div>
    </div>
  );
}
