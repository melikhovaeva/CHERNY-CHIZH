import { cn } from '@/shared/lib/utils'
import styles from './Button.module.scss'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button = ({ children, onClick, disabled, className, variant = 'primary' }: ButtonProps) => {
  return (
    <button type="button" className={cn([styles.button, styles[`variant-${variant}`], className || ''])} onClick={onClick} disabled={disabled} aria-disabled={disabled}>
      {children}
    </button>
  )
}
