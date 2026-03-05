import { Link } from '@tanstack/react-router';
import type { DogByBreedListRead, Puppy } from '../../model/types';
import { formatPuppyDate } from '../../model/utils';
import styles from './PuppyCharacteristics.module.scss';

interface PuppyCharacteristicsProps {
  puppy: Puppy | DogByBreedListRead;
  className?: string;
}

export const PuppyCharacteristics = ({
  puppy,
  className,
}: PuppyCharacteristicsProps) => {
  const parents =
    'parents' in puppy ? (puppy as Puppy).parents : undefined;
  const parentsExists = parents && Object.keys(parents).length > 0;
  const documentsExists = puppy.documents && puppy.documents?.length > 0;

  const puppyMother = parents?.mother;
  const puppyFather = parents?.father;

  return (
    <dl className={[styles.list, className].filter(Boolean).join(' ')}>
      <div className={styles.item}>
        <dt className={styles.label}>Статус:</dt>
        <dd className={styles.value}>{puppy.status.label}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Дата рождения:</dt>
        <dd className={styles.value}>{formatPuppyDate(puppy.birthDate)}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Пол:</dt>
        <dd className={styles.value}>{puppy.sex.label}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Окрас:</dt>
        <dd className={styles.value}>{puppy.color}</dd>
      </div>
      {documentsExists && (
        <div className={styles.item}>
          <dt className={styles.label}>Документы:</dt>
          <dd className={styles.value}>
            {puppy.documents?.map((document) => document.name).join(', ')}
          </dd>
        </div>
      )}
      <div className={styles.item}>
        <dt className={styles.label}>Потенциал:</dt>
        <dd className={styles.value}>{puppy.potential.label}</dd>
      </div>
      {parentsExists && (
        <div className={styles.item}>
          <dt className={styles.label}>Родители:</dt>
          <dd className={styles.value}>
            <div className={styles.parents__links}>
              {puppyMother && (
                <Link
                  to="/dogs/$breedId/$dogId"
                  params={{
                    breedId: puppy.breed.slug,
                    dogId: String(puppyMother.id),
                  }}
                >
                  {puppyMother.name}
                </Link>
              )}
              {puppyFather && (
                <Link
                  to="/dogs/$breedId/$dogId"
                  className={styles.value__link}
                  params={{
                    breedId: puppy.breed.slug,
                    dogId: String(puppyFather.id),
                  }}
                >
                  {puppyFather.name}
                </Link>
              )}
            </div>
          </dd>
        </div>
      )}
    </dl>
  );
};
