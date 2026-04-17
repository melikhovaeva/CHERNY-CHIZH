import { useAppSelector } from '@/app/store';
import { useGetBreedsQuery } from '@/entities/breed';
import { useV1NurseryDogsListQuery } from '@/entities/nursery-dog';
import { selectIsAdmin } from '@/entities/session';
import type { DogListRead } from '@/shared/api/generated/nursery.generated';
import { SearchInput } from '@/shared/ui';
import { Button, Select } from '@/shared/ui/components';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
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

  const { data: dogsData, isLoading } = useV1NurseryDogsListQuery(
    { limit: 100, offset: 0 },
    { skip: isNestedRoute },
  );

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

  const dogs = useMemo(() => dogsData?.results ?? [], [dogsData]);

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog: DogListRead) => {
      if (ageGroup && dog.ageGroup !== ageGroup) return false;
      if (breedFilter) {
        const breedMatch = breeds?.find((b) => String(b.id) === breedFilter);
        if (breedMatch && dog.breed?.name !== breedMatch.name) return false;
        if (!breedMatch) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = [dog.name, dog.internationalName, dog.color].filter(
          Boolean,
        );
        if (!searchable.some((s) => s?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [dogs, ageGroup, breedFilter, searchQuery, breeds]);

  if (isNestedRoute) {
    return <Outlet />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <Select
            label="Тип"
            options={AGE_GROUP_OPTIONS}
            variant="input"
            value={ageGroup}
            onChange={setAgeGroup}
            className={styles.ageSelect}
          />
          <Select
            label="Порода"
            variant="input"
            options={breedOptions}
            value={breedFilter}
            onChange={setBreedFilter}
            className={styles.breedSelect}
          />
        </div>
        <SearchInput
          value={searchQuery}
          onSearchChange={setSearchQuery}
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
      ) : filteredDogs.length === 0 ? (
        <div className={styles.emptyState}>Собаки не найдены</div>
      ) : (
        <div className={styles.grid}>
          {filteredDogs.map((dog: DogListRead) => (
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
      )}
    </div>
  );
}
