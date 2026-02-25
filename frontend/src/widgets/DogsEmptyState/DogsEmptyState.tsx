import { cn } from '@/shared/lib/utils';
import { PuppyNotFoundIcon } from '@/shared/ui/assets';
import styles from './DogsEmptyState.module.scss';

interface DogsEmptyStateProps {
  className?: string;
}

export function DogsEmptyState({ className }: DogsEmptyStateProps) {
  return (
    <div className={cn([styles.root, className || ''])}>
      <div className={styles.content}>
        <h3 className={styles.title}>Нет доступных собак</h3>
        <p className={styles.paragraph}>
          В данный момент нет собак этой породы для просмотра. Загляните позже
          или посмотрите наших щенков.
        </p>
      </div>
      <div className={styles.illustration}>
        <PuppyNotFoundIcon className={styles.image} aria-hidden />
      </div>
    </div>
  );
}
