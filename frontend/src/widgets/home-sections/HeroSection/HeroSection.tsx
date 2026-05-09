import { getFirstPhotoUrl } from '@/entities/puppy';
import { useGetPuppiesByBreedQuery } from '@/entities/puppy/api/puppy.api';
import type { DogByBreedListRead } from '@/shared/api/generated/dogs.generated';
import { Skeleton } from '@/shared/ui/components';
import { useMemo } from 'react';
import styles from './HeroSection.module.scss';

const HERO_BREEDS = [
  { slug: 'shpits', name: 'Шпиц' },
  { slug: 'korgi', name: 'Корги' },
  { slug: 'siba-inu', name: 'Сиба-ину' },
  { slug: 'sharpej', name: 'Шарпей' },
] as const;

const HERO_FETCH_SIZE = 20;

export function HeroSection() {
  const spitz = useGetPuppiesByBreedQuery({ breedSlug: 'shpits', pageSize: HERO_FETCH_SIZE });
  const corgi = useGetPuppiesByBreedQuery({ breedSlug: 'korgi', pageSize: HERO_FETCH_SIZE });
  const shiba = useGetPuppiesByBreedQuery({ breedSlug: 'siba-inu', pageSize: HERO_FETCH_SIZE });
  const sharpei = useGetPuppiesByBreedQuery({ breedSlug: 'sharpej', pageSize: HERO_FETCH_SIZE });

  const isLoading = spitz.isLoading || corgi.isLoading || shiba.isLoading || sharpei.isLoading;

  const selectedPuppies = useMemo(() => {
    const queries = [spitz, corgi, shiba, sharpei];
    return queries.map((q) => {
      const withPhotos = (q.data?.results ?? []).filter(
        (p: DogByBreedListRead) => p.photos && p.photos.length > 0,
      );
      if (!withPhotos.length) return null;
      return withPhotos[Math.floor(Math.random() * withPhotos.length)];
    });
    // Re-pick random when data changes (initial load); stable during re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spitz.data, corgi.data, shiba.data, sharpei.data]);

  const items = isLoading ? Array.from({ length: 4 }, () => null) : selectedPuppies;

  return (
    <section className={styles.root}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Чемпионы ринга и верные друзья</h1>
        <p className={styles.description}>
          Наши собаки уверенно чувствуют себя на ринге и остаются надёжными
          компаньонами дома
        </p>
      </div>
      <div className={styles.scroll}>
        <ul className={styles.list}>
          {items.map((puppy, index) => (
            <li className={styles.listItem} key={puppy?.id ?? index}>
              {puppy ? (
                <img
                  className={styles.photo}
                  src={getFirstPhotoUrl(puppy) ?? ''}
                  alt={HERO_BREEDS[index]?.name ?? ''}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
