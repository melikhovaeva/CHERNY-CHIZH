import {
  type DogByBreedListRead,
  PuppyCard,
  PuppyCardSkeleton,
  useGetDogsByBreedQuery,
} from '@/entities/puppy';
import { matchPuppyByFilters, type PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DogsEmptyState } from '../DogsEmptyState';
import styles from './DogsList.module.scss';

interface DogsListProps {
  breedId?: string;
  filters?: PuppyFilters;
  className?: string;
}

const PAGE_SIZE = 6;
const SKELETON_COUNT = 6;

export function DogsList({ breedId, filters, className }: DogsListProps) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DogByBreedListRead[]>([]);

  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, isFetching, isError } = useGetDogsByBreedQuery(
    { breedSlug: breedId || '', page, pageSize: PAGE_SIZE },
    { skip: !breedId },
  );

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [breedId, filters]);

  useEffect(() => {
    if (!data?.results) return;

    setItems((prev) => {
      const existingIds = new Set(prev.map((d: DogByBreedListRead) => d.id));
      const nextItems = data.results.filter((d: DogByBreedListRead) => !existingIds.has(d.id));
      return [...prev, ...nextItems];
    });
  }, [data]);

  const hasMore = useMemo(() => {
    if (!data) return false;
    if (data.next) return true;
    return data.results.length > 0 && data.count > items.length;
  }, [data, items.length]);

  hasMoreRef.current = hasMore;
  isFetchingRef.current = isFetching;

  useEffect(() => {
    if (!isFetching) {
      isLoadingMoreRef.current = false;
    }
  }, [isFetching]);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current &&
          !isLoadingMoreRef.current
        ) {
          isLoadingMoreRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px 0px' },
    );

    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const filteredDogs = useMemo(
    () =>
      items.filter((dog) =>
        matchPuppyByFilters(dog, filters ?? PUPPY_FILTERS_DEFAULTS),
      ),
    [items, filters],
  );

  if (isLoading && items.length === 0) {
    return (
      <div className={className}>
        <div className={styles.list}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <PuppyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && !isFetching && (isError || filteredDogs.length === 0)) {
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
        {isFetching && <PuppyCardSkeleton />}
        {hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
      </div>
    </div>
  );
}
