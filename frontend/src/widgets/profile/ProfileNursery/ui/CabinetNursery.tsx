import { useAppSelector } from '@/app/store';
import { useGetBreedsQuery } from '@/entities/breed';
import { useInfiniteNurseryDogs } from '@/entities/nursery-dog';
import { selectIsAdmin } from '@/entities/session';
import type { DogListRead } from '@/shared/api/generated/nursery.generated';
import { SearchInput } from '@/shared/ui';
import { Button, Select } from '@/shared/ui/components';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './CabinetNursery.module.scss';
import { NurseryDogCard } from './NurseryDogCard';

const AGE_GROUP_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'puppy', label: 'Щенок' },
  { value: 'adult', label: 'Собака' },
];

export function CabinetNursery() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useAppSelector(selectIsAdmin);

  const [ageGroup, setAgeGroup] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const isNestedRoute =
    location.pathname.startsWith('/cabinet/nursery/') &&
    location.pathname !== '/cabinet/nursery';

  const { data: breeds } = useGetBreedsQuery(undefined, {
    skip: isNestedRoute,
  });

  const breedOptions = useMemo(() => {
    const opts = [{ value: '', label: 'Все породы' }];
    if (breeds) {
      for (const breed of breeds) {
        opts.push({ value: String(breed.id), label: breed.name });
      }
    }
    return opts;
  }, [breeds]);

  const { dogs, isFetching, isLoading, fetchNextPage } =
    useInfiniteNurseryDogs({
      ageGroup: ageGroup || undefined,
      breedId: breedFilter || undefined,
      search: searchQuery || undefined,
      skip: isNestedRoute,
    });

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPageRef.current();
        }
      },
      { rootMargin: '200px' },
    );
    observerRef.current.observe(node);
  }, []);

  const handleFilterChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (value: string) => {
        setter(value);
      },
    [],
  );

  if (isNestedRoute) {
    return <Outlet />;
  }

  const showEmpty = !isLoading && !isFetching && dogs.length === 0;

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <Select
            label="Тип"
            options={AGE_GROUP_OPTIONS}
            variant="input"
            value={ageGroup}
            onChange={handleFilterChange(setAgeGroup)}
            className={styles.ageSelect}
          />
          <Select
            label="Порода"
            variant="input"
            options={breedOptions}
            value={breedFilter}
            onChange={handleFilterChange(setBreedFilter)}
            className={styles.breedSelect}
          />
        </div>
        <SearchInput
          value={searchQuery}
          onSearchChange={handleFilterChange(setSearchQuery)}
          placeholder="Поиск по имени"
          className={styles.search}
          ariaLabel="Поиск по собакам"
        />
        {isAdmin && (
          <Button
            className={styles.addButton}
            variant="crm"
            onClick={() => navigate({ to: '/cabinet/nursery/new' })}
          >
            Добавить собаку
          </Button>
        )}
      </div>

      {isLoading && dogs.length === 0 ? (
        <div className={styles.emptyState}>Загрузка...</div>
      ) : showEmpty ? (
        <div className={styles.emptyState}>Собаки не найдены</div>
      ) : (
        <>
          <div className={styles.grid}>
            {dogs.map((dog: DogListRead) => (
              <NurseryDogCard
                key={dog.id}
                dog={dog}
                onClick={() =>
                  navigate({
                    to: '/cabinet/nursery/$dogId',
                    params: { dogId: String(dog.id) },
                  })
                }
              />
            ))}
          </div>

          <div ref={sentinelRef} className={styles.sentinel} aria-hidden />

          {isFetching && dogs.length > 0 && (
            <div className={styles.loadingMore}>Загрузка...</div>
          )}
        </>
      )}
    </div>
  );
}
