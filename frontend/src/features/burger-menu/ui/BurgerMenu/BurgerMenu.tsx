import { cn } from '@/shared/lib/utils'
import { useEffect } from 'react'
import styles from './BurgerMenu.module.scss'

export interface BurgerMenuLink {
  to: string
  label: string
}

interface BurgerMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export function BurgerMenu({ isOpen, onClose, onOpen }: BurgerMenuProps) {
  const handleToggle = () => (isOpen ? onClose() : onOpen())

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <button
      type="button"
      className={cn([styles.trigger, isOpen ? styles.trigger_open : ''])}
      onClick={handleToggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
    >
      <span className={styles.trigger__line} />
      <span className={styles.trigger__line} />
      <span className={styles.trigger__line} />
    </button>
  )
}
