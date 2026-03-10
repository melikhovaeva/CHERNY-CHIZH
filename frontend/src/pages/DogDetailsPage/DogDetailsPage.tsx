import { PuppyCard, useGetPuppyQuery } from '@/entities/puppy';
import { PuppyTabsSection } from '@/widgets';
import { useParams } from '@tanstack/react-router';
import styles from './DogDetailsPage.module.scss';

export function DogDetailsPage() {
  const { breedId, dogId } = useParams({
    from: '/dogs/$breedId/$dogId',
  });
  const id = Number(dogId);
  const {
    data: dog,
    isLoading,
    isError,
  } = useGetPuppyQuery(id, {
    skip: !dogId || Number.isNaN(id),
  });

  if (isLoading) {
    return (
      <div className={styles.root}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (isError || !dog || dog.breed.slug !== breedId) {
    return (
      <div className={styles.notFound}>
        <p>Собака не найдена.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{dog.name}</h1>
      <div className={styles.container}>
        <PuppyCard
          puppy={dog}
          detailed
          showBookingButton={false}
          detailPathPrefix="dogs"
          className={styles.details}
        />
        <PuppyTabsSection puppy={dog} className={styles.tabs} />
      </div>
    </div>
  );
}
