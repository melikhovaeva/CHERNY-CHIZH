import { cn } from '@/shared/lib/utils'
import type { Tab } from '../model/types'
import styles from './Tabs.module.scss'

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <ul className={cn([styles.list, className || ''])} role="tablist">
      {tabs.map((tab) => (
        <li key={tab.uid} className={styles.item} role="presentation">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            className={cn([
              styles.button,
              activeTab === tab.value ? styles.button_active : '',
            ])}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
