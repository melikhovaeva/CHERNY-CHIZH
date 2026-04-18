import { useCallback, useEffect, useRef, useState } from 'react';
import type { DogListRead } from '@/shared/api/generated/nursery.generated';
import {
  useNurseryDogsFilteredListQuery,
  type NurseryDogsListParams,
} from '../api/nurseryDog.api';

const PAGE_SIZE = 20;

interface UseInfiniteNurseryDogsParams {
  ageGroup?: string;
  breedId?: string;
  search?: string;
  skip?: boolean;
}

interface UseInfiniteNurseryDogsResult {
  dogs: DogListRead[];
  isFetching: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
  reset: () => void;
}

export function useInfiniteNurseryDogs({
  ageGroup,
  breedId,
  search,
  skip,
}: UseInfiniteNurseryDogsParams): UseInfiniteNurseryDogsResult {
  const [offset, setOffset] = useState(0);
  const [allDogs, setAllDogs] = useState<DogListRead[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const filterKey = `${ageGroup ?? ''}|${breedId ?? ''}|${search ?? ''}`;
  const prevFilterKeyRef = useRef(filterKey);

  // Reset when filters change
  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey;
      setOffset(0);
      setAllDogs([]);
      setHasMore(true);
    }
  }, [filterKey]);

  const queryParams: NurseryDogsListParams = {
    limit: PAGE_SIZE,
    offset,
    ...(ageGroup ? { ageGroup } : {}),
    ...(breedId ? { breedId } : {}),
    ...(search ? { search } : {}),
  };

  const { data, isFetching, isLoading } = useNurseryDogsFilteredListQuery(
    queryParams,
    { skip },
  );

  // Accumulate results when data changes
  const prevOffsetRef = useRef(offset);
  useEffect(() => {
    if (!data) return;
    const results = data.results ?? [];
    if (offset === 0 || prevOffsetRef.current !== offset) {
      prevOffsetRef.current = offset;
      setAllDogs((prev) => (offset === 0 ? results : [...prev, ...results]));
      setHasMore(results.length === PAGE_SIZE && data.next != null);
    }
  }, [data, offset]);

  const fetchNextPage = useCallback(() => {
    if (!isFetching && hasMore) {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }, [isFetching, hasMore]);

  const reset = useCallback(() => {
    setOffset(0);
    setAllDogs([]);
    setHasMore(true);
  }, []);

  return { dogs: allDogs, isFetching, isLoading, hasMore, fetchNextPage, reset };
}
