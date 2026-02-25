import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/components';
import styles from './PuppyCard.module.scss';

interface PuppyCardSkeletonProps {
  className?: string;
  showSecondaryButton?: boolean;
}

export const PuppyCardSkeleton = ({
  className,
  showSecondaryButton = false,
}: PuppyCardSkeletonProps) => {
  return (
    <div className={cn([styles.card, className || ''])}>
      <div className={styles.card__imageSection}>
        <Skeleton width="100%" height="100%" />
      </div>
      <div className={styles.card__contentSection}>
        <div className={styles.card__contentSection__header}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>
        <div className={styles.card__buttonContainer}>
          <Skeleton width={140} height={48} />
          {showSecondaryButton && <Skeleton width={140} height={48} />}
        </div>
      </div>
    </div>
  );
};

