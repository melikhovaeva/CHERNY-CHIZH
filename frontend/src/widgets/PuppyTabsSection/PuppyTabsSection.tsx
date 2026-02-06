import { PuppyGallery, PuppyParents } from '@/entities/puppy'
import type { Puppy } from '@/entities/puppy'
import { Tabs } from '@/features/tabs-filter'
import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import styles from './PuppyTabsSection.module.scss'

const TAB_DESCRIPTION = 'description'
const TAB_PHOTOS = 'photos'
const TAB_PARENTS = 'parents'

const TABS = [
  { uid: 'desc', label: 'Описание', value: TAB_DESCRIPTION },
  { uid: 'photos', label: 'Фотографии', value: TAB_PHOTOS },
  { uid: 'parents', label: 'Родители', value: TAB_PARENTS },
]

interface PuppyTabsSectionProps {
  puppy: Puppy
  className?: string
}

export function PuppyTabsSection({ puppy, className }: PuppyTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(TAB_PHOTOS)

  return (
    <section className={cn([styles.root, className || ''])}>
      <div className={styles.tabsWrapper}>
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className={styles.tabs}
        />
      </div>
      <div className={styles.content}>
        {activeTab === TAB_DESCRIPTION && (
          <div className={styles.panel}>
            {puppy.description ? (
              <p className={styles.description}>{puppy.description}</p>
            ) : (
              <p className={styles.description}>Описание пока не добавлено.</p>
            )}
          </div>
        )}
        {activeTab === TAB_PHOTOS && (
          <div className={styles.panel}>
            <PuppyGallery puppy={puppy} />
          </div>
        )}
        {activeTab === TAB_PARENTS && (
          <div className={styles.panel}>
            <PuppyParents puppy={puppy} />
          </div>
        )}
      </div>
    </section>
  )
}
