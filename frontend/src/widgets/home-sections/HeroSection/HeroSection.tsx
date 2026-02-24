import { Placeholder } from '@/shared/ui/components';
import { useGetPuppiesQuery } from '@/entities/puppy/api/puppy.api';
import { getFirstPhotoUrl } from '@/entities/puppy/model/utils';
import styles from './HeroSection.module.scss';

export function HeroSection() {
  const { data: puppies, isLoading } = useGetPuppiesQuery();

  const puppiesWithPhotos = (puppies ?? []).filter(
    (puppy) => puppy.photos && puppy.photos.length > 0,
  );

  const getRandomPuppies = () => {
    if (!puppiesWithPhotos.length) {
      return [];
    }

    const shuffled = [...puppiesWithPhotos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  const randomPuppies = !isLoading ? getRandomPuppies() : [];

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
          {(randomPuppies.length ? randomPuppies : Array.from({ length: 4 })).map(
            (puppyOrPlaceholder, index) => (
              <li className={styles.listItem} key={index}>
                {typeof puppyOrPlaceholder === 'object' &&
                puppyOrPlaceholder !== null ? (
                  <img
                    className={styles.photo}
                    src={getFirstPhotoUrl(puppyOrPlaceholder) ?? ''}
                    alt={puppyOrPlaceholder.name}
                  />
                ) : (
                  <Placeholder className={styles.placeholder} />
                )}
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
