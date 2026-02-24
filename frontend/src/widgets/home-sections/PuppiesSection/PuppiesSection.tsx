import {
  selectSelectedBreedSlug,
  setSelectedBreed,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux';
import { useGetBreedsQuery } from '@/entities/breed/api/breed.api';
import { getFirstPhotoUrl } from '@/entities/puppy';
import { useGetPuppiesByBreedQuery } from '@/entities/puppy/api/puppy.api';
import { cn } from '@/shared/lib/utils';
import { Button, Card, Skeleton } from '@/shared/ui/components';
import { FilterableGallery } from '@/widgets';
import { useRouter } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import styles from './PuppiesSection.module.scss';

export function PuppiesSection() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const selectedBreedSlug = useAppSelector(selectSelectedBreedSlug);

  const {
    data: breeds,
    isLoading: isBreedsLoading,
    isFetching: isBreedsFetching,
  } = useGetBreedsQuery();

  const shouldSkipPuppiesQuery = !breeds?.length || !selectedBreedSlug;

  const {
    data: puppies,
    isLoading: isPuppiesLoading,
    isFetching: isPuppiesFetching,
  } = useGetPuppiesByBreedQuery(selectedBreedSlug || '', {
    skip: shouldSkipPuppiesQuery,
  });

  const breedTabs = useMemo(
    () =>
      breeds?.map((breed) => ({
        id: breed.id,
        label: breed.name,
        value: breed.slug,
      })) ?? [],
    [breeds],
  );

  useEffect(() => {
    if (breedTabs.length > 0 && !selectedBreedSlug) {
      dispatch(setSelectedBreed(breedTabs[0].value));
    }
  }, [breedTabs, selectedBreedSlug, dispatch]);

  const activeBreed = selectedBreedSlug || (breedTabs[0]?.value ?? '');

  const isLoadingPuppiesSection =
    isBreedsLoading ||
    isBreedsFetching ||
    (!shouldSkipPuppiesQuery && (isPuppiesLoading || isPuppiesFetching));

  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {isLoadingPuppiesSection ? (
            <Skeleton height={64} width="100%" />
          ) : (
            'Наши Щенки'
          )}
        </h2>

        {isLoadingPuppiesSection ? (
          <div className={styles.skeletonGallery}>
            <Skeleton
              height={38}
              width="100%"
              className={styles.skeletonTabs}
            />
            {Array.from({ length: 3 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className={styles.skeletonCard}>
                <Skeleton height={385} />
              </div>
            ))}
          </div>
        ) : (
          puppies && (
            <FilterableGallery
              tabs={breedTabs}
              items={puppies.slice(0, 3)}
              filterBy="breed"
              activeTab={activeBreed}
              onActiveTabChange={(value) => dispatch(setSelectedBreed(value))}
              getItemKey={(puppy) => puppy.id}
              getFilterValue={(puppy) => puppy.breed.slug}
              renderItem={(puppy) => (
                <Card imgUrl={getFirstPhotoUrl(puppy)} subtitle={puppy.name} />
              )}
              className={styles.gallery}
            />
          )
        )}

        <div className={styles.buttonContainer}>
          {isLoadingPuppiesSection ? (
            <Skeleton className={styles.skeletonButton} height={55} />
          ) : (
            <Button
              onClick={() => {
                const breedId = activeBreed || breedTabs[0]?.value;
                if (!breedId) return;
                router.navigate({
                  to: '/puppies/$breedId',
                  params: { breedId },
                });
              }}
            >
              Смотреть всех
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
