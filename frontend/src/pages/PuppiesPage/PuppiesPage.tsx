import { setSelectedBreed } from '@/features/selected-breed';
import { useAppDispatch } from '@/app/store';
import { useGetBreedsQuery } from '@/entities/breed';
import type { PuppyFilters } from '@/features';
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults';
import type { Tab } from '@/features/tabs-filter';
import { Tabs } from '@/features/tabs-filter';
import { DeliverySection, PuppiesFilters, PuppiesList } from '@/widgets';
import { useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import styles from './PuppiesPage.module.scss';

export const PuppiesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { breedId } = useParams({
    from: '/puppies/$breedId',
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
    router.navigate({ to: '/puppies/$breedId', params: { breedId: value } });
  };

  return (
    <div className={styles.main}>
      <section className={styles.catalogSection}>
        <div className={styles.titleContainer}>
          <h2>
            Щенки
            <span className={styles.breedName}> {breedTitle}</span>
          </h2>
          <p className={styles.breedDescription}>
            Привиты по возрасту, с клеймом, ветеринарным паспортом и документами
            РКФ. Возможна установка микрочипа
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
            <PuppiesList breedId={breedId} filters={filters} />
          </div>
        </div>
      </section>
      <DeliverySection />
    </div>
  );
};
