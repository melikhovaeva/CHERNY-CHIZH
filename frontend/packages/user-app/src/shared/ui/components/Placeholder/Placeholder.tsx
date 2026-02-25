import { cn } from '@/shared/lib/utils';
import { PuppyNotFoundIcon } from '@/shared/ui/assets';
import styles from './Placeholder.module.scss';

interface PlaceholderProps {
  className?: string;
}

export const Placeholder = ({ className }: PlaceholderProps) => {
  return (
    <div className={cn([styles.placeholder, className || ''])}>
      <PuppyNotFoundIcon className={styles.placeholder__image} />
    </div>
  );
};
