import {
  PuppyCard,
  PuppyCardSkeleton,
  useGetPuppiesByBreedQuery,
} from '@/entities/puppy';
import { matchPuppyByFilters, type PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import { PuppiesEmptyState } from '@/widgets';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './PuppiesList.module.scss';

interface PuppiesListProps {
  breedId?: string;
  filters?: PuppyFilters;
  className?: string;
}

const PAGE_SIZE = 6;
const SKELETON_COUNT = 6;

export function PuppiesList({ breedId, filters, className }: PuppiesListProps) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<
    Array<Parameters<typeof matchPuppyByFilters>[0]>
  >([]);

  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, isFetching, isError } = useGetPuppiesByBreedQuery(
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
      const existingIds = new Set(prev.map((puppy) => puppy.id));
      const nextItems = data.results.filter(
        (puppy) => !existingIds.has(puppy.id),
      );
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

  const filteredPuppies = useMemo(
    () =>
      items.filter((puppy) =>
        matchPuppyByFilters(puppy, filters ?? PUPPY_FILTERS_DEFAULTS),
      ),
    [items, filters],
  );

  if (isLoading && items.length === 0) {
    return (
      <div className={className}>
        <div className={styles.list}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <PuppyCardSkeleton key={i} showSecondaryButton />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && !isFetching && (isError || filteredPuppies.length === 0)) {
    return (
      <div className={className}>
        <PuppiesEmptyState />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.list}>
        {filteredPuppies.map((puppy) => (
          <PuppyCard key={puppy.id} puppy={puppy} />
        ))}
        {isFetching && <PuppyCardSkeleton showSecondaryButton />}
        {hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
      </div>
    </div>
  );
}
