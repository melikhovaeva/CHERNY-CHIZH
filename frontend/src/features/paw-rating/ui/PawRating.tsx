import { cn } from '@/shared/lib/utils'
import styles from './PawRating.module.scss'

const MAX = 5
const PAW_OUTLINE = '/paw.svg'
const PAW_FILLED = '/paw-filled.svg'

interface PawRatingProps {
  value: number
  max?: number
  className?: string
}

export function PawRating({ value, max = MAX, className }: PawRatingProps) {
  const filled = Math.min(Math.max(0, value), max)
  return (
    <span
      className={cn([styles.root, className ?? ''])}
      role="img"
      aria-label={`${value} из ${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <img
          key={i}
          src={i < filled ? PAW_FILLED : PAW_OUTLINE}
          alt=""
          className={cn([styles.paw, i < filled ? styles.paw_filled : ''])}
          aria-hidden
        />
      ))}
    </span>
  )
}
