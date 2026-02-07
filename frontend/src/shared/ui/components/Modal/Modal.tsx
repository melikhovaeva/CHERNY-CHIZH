import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Backdrop } from '../Backdrop'
import ArrowLeftIcon from './assets/arrow-left.svg?react'
import styles from './Modal.module.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus()
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const content = (
    <div className={styles.root} role="dialog" aria-modal="true">
      <Backdrop
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden={true}
      />
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.content}>
          <div className={styles.header}>
            {title != null && title}
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              <ArrowLeftIcon width={24} height={24} aria-hidden />
            </button>
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
