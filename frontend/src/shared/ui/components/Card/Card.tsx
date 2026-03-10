import { cn } from '@/shared/lib/utils';
import { Placeholder } from '../Placeholder';
import styles from './Card.module.scss';

interface CardProps {
  title?: string;
  subtitle?: string;
  imgUrl?: string;
  className?: string;
}

export const Card = ({
  title = 'Черный чиж',
  subtitle,
  imgUrl,
  className,
}: CardProps) => {
  return (
    <div className={cn([styles.card, className || ''])}>
      {imgUrl && imgUrl.length > 0 ? (
        <img className={styles.card__image} src={imgUrl} alt={subtitle} />
      ) : (
        <Placeholder className={styles.card__placeholder} />
      )}
      <div className={styles.card__content}>
        <h4 className={styles.card__title}>
          <span className={styles.card__title__text}>{title}</span>
          {subtitle && (
            <span className={styles.card__title__text}>{subtitle}</span>
          )}
        </h4>
      </div>
    </div>
  );
};
