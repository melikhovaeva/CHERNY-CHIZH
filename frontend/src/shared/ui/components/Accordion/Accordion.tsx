import { cn } from '@/shared/lib/utils'
import { useCallback, useState } from 'react'
import styles from './Accordion.module.scss'
import PlusIcon from './assets/plus.svg?react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  allowMultiple?: boolean
  className?: string
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const initialOpen = defaultOpenId ?? items[0]?.id ?? null
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(initialOpen ? [initialOpen] : [])
  )

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          if (!allowMultiple) next.clear()
          next.add(id)
        }
        return next
      })
    },
    [allowMultiple]
  )

  return (
    <div className={cn([styles.root, className ?? ''])}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        const contentId = `accordion-content-${item.id}`
        return (
          <div
            key={item.id}
            className={cn(
              [styles.item,
              className || ''],
              { [styles.item__open]: isOpen },
            )}
          >
            <div className={styles.itemHeader}>
              <button
                type="button"
                className={styles.trigger}
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                id={`accordion-trigger-${item.id}`}
              >
                <h4 className={styles.triggerTitle}>{item.title}</h4>
                <span
                  className={cn([
                    styles.triggerIcon,
                    isOpen ? styles.triggerIcon_open : styles.triggerIcon_closed,
                  ])}
                  aria-hidden
                >
                  <PlusIcon width={32} height={32} aria-hidden />
                </span>
              </button>
            </div>
            <div
              id={contentId}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              aria-hidden={!isOpen}
              className={cn([styles.content, isOpen ? styles.content__open : ''])}
            >
              <div className={styles.contentInner}>{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
