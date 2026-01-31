import { cn } from '@/shared/lib/utils'
import styles from './Backdrop.module.scss'

interface BackdropProps {
  onClick?: () => void
  className?: string
  'aria-hidden'?: boolean
}

export function Backdrop({
  onClick,
  className,
  'aria-hidden': ariaHidden,
}: BackdropProps) {
  return (
    <div
      className={cn([styles.backdrop, className ?? ''])}
      onClick={onClick}
      aria-hidden={ariaHidden}
    />
  )
}
