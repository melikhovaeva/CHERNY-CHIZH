import { Link } from '@tanstack/react-router';
import type { Puppy } from '../../model/types';
import { formatPuppyDate } from '../../model/utils';
import styles from './PuppyCharacteristics.module.scss';

interface PuppyCharacteristicsProps {
  puppy: Puppy;
  className?: string;
}

export const PuppyCharacteristics = ({
  puppy,
  className,
}: PuppyCharacteristicsProps) => {
  const parentsExists = puppy.parents && Object.keys(puppy.parents).length > 0;
  const documentsExists = puppy.documents && puppy.documents?.length > 0;

  const puppyMother = puppy.parents?.mother;
  const puppyFather = puppy.parents?.father;

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
            {puppy.documents?.map((document) =>
              document.url ? (
                <a
                  key={document.id}
                  className={styles.value__link}
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {document.name}
                </a>
              ) : (
                <span key={document.id}>{document.name}</span>
              ),
            )}
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
            {puppyMother && (
              <p>
                <Link
                  to="/dogs/$breedId/$dogId"
                  params={{
                    breedId: puppy.breed.slug,
                    dogId: String(puppyMother.id),
                  }}
                >
                  {puppyMother.name}
                </Link>
              </p>
            )}
            {puppyFather && (
              <p>
                <Link
                  to="/dogs/$breedId/$dogId"
                  params={{
                    breedId: puppy.breed.slug,
                    dogId: String(puppyFather.id),
                  }}
                >
                  {puppyFather.name}
                </Link>
              </p>
            )}
          </dd>
        </div>
      )}
    </dl>
  );
};
