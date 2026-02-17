import { PuppyCard, useGetPuppiesQuery } from '@/entities/puppy';
import { matchPuppyByFilters, type PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import { PuppiesEmptyState } from '@/widgets';
import styles from './PuppiesList.module.scss';

interface PuppiesListProps {
  breedId?: string;
  filters?: PuppyFilters;
  className?: string;
}

export function PuppiesList({ breedId, filters, className }: PuppiesListProps) {
  const { data: allPuppies, isLoading } = useGetPuppiesQuery();
  const puppies = (allPuppies ?? []).filter((puppy) => {
    if (breedId && puppy.breed.slug !== breedId) return false;
    return matchPuppyByFilters(puppy, filters ?? PUPPY_FILTERS_DEFAULTS);
  });

  if (isLoading) return null;

  if (puppies.length === 0) {
    return (
      <div className={className}>
        <PuppiesEmptyState />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.list}>
        {puppies.map((puppy) => (
          <PuppyCard key={puppy.id} puppy={puppy} />
        ))}
      </div>
    </div>
  );
}
