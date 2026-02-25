import { cn } from '@/shared/lib/utils'
import PawFilledIcon from './assets/paw-filled.svg?react'
import PawOutlineIcon from './assets/paw.svg?react'
import styles from './PawRating.module.scss'

const MAX = 5

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
      {Array.from({ length: max }, (_, i) => {
        const Icon = i < filled ? PawFilledIcon : PawOutlineIcon
        return (
          <Icon
            key={i}
            className={cn([styles.paw, i < filled ? styles.paw_filled : ''])}
            aria-hidden
          />
        )
      })}
    </span>
  )
}
