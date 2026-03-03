import { setSelectedBreed } from '@/features/selected-breed';
import { useAppDispatch } from '@/shared/lib/store';
import { useGetBreedsQuery } from '@/entities/breed';
import type { PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import type { Tab } from '@/features/tabs-filter';
import { Tabs } from '@/features/tabs-filter';
import { DogsList, PuppiesFilters } from '@/widgets';
import { useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import styles from './DogsPage.module.scss';

export const DogsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { breedId } = useParams({
    from: '/dogs/$breedId',
  }) as { breedId: string };
  const { data: breeds } = useGetBreedsQuery();
  const [filters, setFilters] = useState<PuppyFilters>(PUPPY_FILTERS_DEFAULTS);

  useEffect(() => {
    if (breedId) dispatch(setSelectedBreed(breedId));
  }, [breedId, dispatch]);

  const breedTabs: Tab[] = useMemo(
    () =>
      breeds?.map((breed) => ({
        id: breed.id,
        label: breed.name,
        value: breed.slug,
      })) ?? [],
    [breeds],
  );

  const breedTitle = useMemo(
    () => breeds?.find((b) => b.slug === breedId)?.fullName ?? breedId,
    [breeds, breedId],
  );

  const handleBreedTabChange = (value: string) => {
    dispatch(setSelectedBreed(value));
    router.navigate({ to: '/dogs/$breedId', params: { breedId: value } });
  };

  return (
    <div className={styles.main}>
      <section className={styles.catalogSection}>
        <div className={styles.titleContainer}>
          <h2>
            Собаки
            <span className={styles.breedName}> {breedTitle}</span>
          </h2>
          <p className={styles.breedDescription}>
            Взрослые собаки нашего питомника с документами РКФ
          </p>
        </div>
        <div className={styles.catalogContainer}>
          <div>
            <Tabs
              tabs={breedTabs}
              activeTab={breedId}
              onTabChange={handleBreedTabChange}
              className={styles.breedTabs}
            />
          </div>
          <PuppiesFilters
            className={styles.filters}
            value={filters}
            onChange={setFilters}
          />
          <div className={styles.content}>
            <DogsList breedId={breedId} filters={filters} />
          </div>
        </div>
      </section>
    </div>
  );
};
