import { openBookingModal } from '@/features/booking-modal';
import { useAppDispatch } from '@/app/store';
import { cn } from '@/shared/lib/utils';
import { PuppyNotFoundIcon } from '@/shared/ui/assets';
import { Button } from '@/shared/ui/components';
import styles from './PuppiesEmptyState.module.scss';

interface PuppiesEmptyStateProps {
  className?: string;
}

export function PuppiesEmptyState({ className }: PuppiesEmptyStateProps) {
  const dispatch = useAppDispatch();
  return (
    <div className={cn([styles.root, className || ''])}>
      <div className={styles.content}>
        <h3 className={styles.title}>Нет доступных щенков</h3>
        <p className={styles.paragraph}>
          К сожалению, на данный момент все щенки уже нашли свои новые дома.
          Однако вы можете забронировать будущего щенка, чтобы быть первым в
          очереди, когда новые помёты появятся в нашем питомнике.
        </p>
        <p className={styles.paragraph}>
          Забронировав щенка заранее, вы обеспечите себе возможность выбрать
          именно того малыша, который покорит ваше сердце. Свяжитесь с нами
          прямо сейчас, чтобы узнать больше о процессе бронирования и ожидаемых
          помётах.
        </p>
        <Button
          className={styles.button}
          onClick={() => dispatch(openBookingModal(null))}
        >
          Забронировать
        </Button>
      </div>
      <div className={styles.illustration}>
        <PuppyNotFoundIcon className={styles.image} aria-hidden />
      </div>
    </div>
  );
}
