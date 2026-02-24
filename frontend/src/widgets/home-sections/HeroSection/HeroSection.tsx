import { getFirstPhotoUrl, type Puppy } from '@/entities/puppy';
import { useGetPuppiesQuery } from '@/entities/puppy/api/puppy.api';
import { Skeleton } from '@/shared/ui/components';
import styles from './HeroSection.module.scss';

export function HeroSection() {
  const { data: puppies, isLoading } = useGetPuppiesQuery();

  const puppiesWithPhotos = (puppies ?? []).filter(
    (puppy) => puppy.photos && puppy.photos.length > 0,
  );

  const getRandomPuppies = (): Puppy[] => {
    if (!puppiesWithPhotos.length) {
      return [];
    }

    const shuffled = [...puppiesWithPhotos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  const randomPuppies: Puppy[] = !isLoading ? getRandomPuppies() : [];
  const items: (Puppy | null)[] = randomPuppies.length
    ? randomPuppies
    : Array.from({ length: 4 }, () => null);

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
          {items.map((puppy) => (
            <li className={styles.listItem} key={puppy?.id}>
              {puppy ? (
                <img
                  className={styles.photo}
                  src={getFirstPhotoUrl(puppy) ?? ''}
                  alt={puppy.name}
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
