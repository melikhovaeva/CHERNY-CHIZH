import type { DogListRead } from '@/shared/api/generated/nursery.generated';
import { Placeholder } from '@/shared/ui/components';
import { formatPuppyDate } from '@/entities/puppy/model/utils';
import styles from './NurseryDogCard.module.scss';

interface NurseryDogCardProps {
  dog: DogListRead;
  onClick: () => void;
}

export function NurseryDogCard({ dog, onClick }: NurseryDogCardProps) {
  const mainPhoto = dog.photos?.find((p) => p.isMain) ?? dog.photos?.[0];

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageSection}>
        {mainPhoto ? (
          <img className={styles.image} src={mainPhoto.url} alt={dog.name} />
        ) : (
          <Placeholder />
        )}
        {dog.isPublished && (
          <span className={styles.publishedBadge}>
            {formatPuppyDate(dog.updatedAt)}
          </span>
        )}
      </div>
      <div className={styles.content}>
        <h4 className={styles.name}>{dog.name}</h4>
        {dog.internationalName && (
          <p className={styles.internationalName}>{dog.internationalName}</p>
        )}
        <div className={styles.characteristics}>
          <div className={styles.charItem}>
            <span className={styles.charLabel}>Статус:</span>
            <span className={styles.charValue}>{dog.status?.label}</span>
          </div>
          <div className={styles.charItem}>
            <span className={styles.charLabel}>Дата рождения:</span>
            <span className={styles.charValue}>{formatPuppyDate(dog.birthDate)}</span>
          </div>
          <div className={styles.charItem}>
            <span className={styles.charLabel}>Пол:</span>
            <span className={styles.charValue}>{dog.sex?.label}</span>
          </div>
          <div className={styles.charItem}>
            <span className={styles.charLabel}>Потенциал:</span>
            <span className={styles.charValue}>{dog.potential?.label}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <span className={dog.isPublished ? styles.published : styles.unpublished}>
            {dog.isPublished ? 'Опубликован' : 'Не опубликован'}
          </span>
          {dog.isPublished && (
            <span>{formatPuppyDate(dog.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
