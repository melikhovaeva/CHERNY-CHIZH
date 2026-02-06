import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import styles from './PuppiesEmptyState.module.scss'

interface PuppiesEmptyStateProps {
  className?: string
}

export function PuppiesEmptyState({ className }: PuppiesEmptyStateProps) {
  return (
    <div className={cn([styles.root, className || ''])}>
      <div className={styles.content}>
        <h3 className={styles.title}>Нет доступных щенков</h3>
        <p className={styles.paragraph}>
          К сожалению, на данный момент все щенки уже нашли свои новые дома. Однако вы
          можете забронировать будущего щенка, чтобы быть первым в очереди, когда новые
          помёты появятся в нашем питомнике.
        </p>
        <p className={styles.paragraph}>
          Забронировав щенка заранее, вы обеспечите себе возможность выбрать именно того
          малыша, который покорит ваше сердце. Свяжитесь с нами прямо сейчас, чтобы
          узнать больше о процессе бронирования и ожидаемых помётах.
        </p>
        <Button className={styles.button}>Забронировать</Button>
      </div>
      <div className={styles.illustration}>
        <img
          src="/puppy-not-found.svg"
          alt=""
          className={styles.image}
        />
      </div>
    </div>
  )
}
