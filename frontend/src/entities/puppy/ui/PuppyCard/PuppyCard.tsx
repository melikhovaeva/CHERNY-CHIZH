import { openBookingModal, useAppDispatch } from '@/app/redux';
import { cn } from '@/shared/lib/utils';
import { Button, Placeholder } from '@/shared/ui/components';
import { useNavigate } from '@tanstack/react-router';
import type { Puppy } from '../../model/types';
import { getFirstPhotoUrl } from '../../model/utils';
import { PuppyCharacteristics } from '../PuppyCharacteristics';
import styles from './PuppyCard.module.scss';

interface PuppyCardProps {
  puppy: Puppy;
  className?: string;
  detailed?: boolean;
  showBookingButton?: boolean;
  detailPathPrefix?: 'puppies' | 'dogs';
}

export const PuppyCard = ({
  puppy,
  className,
  detailed = false,
  showBookingButton = true,
  detailPathPrefix = 'puppies',
}: PuppyCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToDetails = () => {
    if (detailPathPrefix === 'dogs') {
      navigate({
        to: '/dogs/$breedId/$dogId',
        params: { breedId: puppy.breed.slug, dogId: String(puppy.id) },
      });
    } else {
      navigate({
        to: '/puppies/$breedId/$puppyId',
        params: { breedId: puppy.breed.slug, puppyId: String(puppy.id) },
      });
    }
  };

  const isPhotoExists = puppy.photos?.length && puppy.photos.length > 0;

  return (
    <div className={cn([styles.card, className || ''])}>
      <div className={styles.card__imageSection}>
        {isPhotoExists ? (
          <img
            className={styles.card__image}
            src={getFirstPhotoUrl(puppy)}
            alt={puppy.name}
          />
        ) : (
          <Placeholder />
        )}
      </div>
      <div className={styles.card__contentSection}>
        <div className={styles.card__contentSection__header}>
          {!detailed ? (
            <div>
              <h4 className={styles.card__title}>{puppy.name}</h4>
              {puppy.internationalName && (
                <p className={styles.card__subtitle}>
                  {puppy.internationalName}
                </p>
              )}
            </div>
          ) : (
            <h4 className={styles.card__title}>Характеристики</h4>
          )}
          <PuppyCharacteristics puppy={puppy} />
        </div>
        <div className={styles.card__buttonContainer}>
          {showBookingButton && (
            <Button onClick={() => dispatch(openBookingModal(puppy.id))}>
              Забронировать
            </Button>
          )}
          {!detailed && (
            <Button variant="secondary" onClick={goToDetails}>
              Подробнее
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
