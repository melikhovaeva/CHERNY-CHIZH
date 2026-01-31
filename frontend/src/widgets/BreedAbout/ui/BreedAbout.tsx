import type { BreedDescription } from '@/entities/breed'
import { PawRating } from '@/features/paw-rating'
import { Tabs, type Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
import { BLOCK_LABELS, BreedAboutBlockKey } from '../model/enums'
import styles from './BreedAbout.module.scss'

interface BreedAboutProps {
  tabs: Tab[]
  descriptions: Record<string, BreedDescription>
  getImageUrl: (value: string) => string
  className?: string
  action?: React.ReactNode
}

export function BreedAbout({
  tabs,
  descriptions,
  getImageUrl,
  className,
}: BreedAboutProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value ?? '')
  const description = descriptions[activeTab]

  const blocksToDisplay = Object.values(BreedAboutBlockKey).filter((blockKey) => blockKey !== BreedAboutBlockKey.APPEARANCE) as Exclude<
    BreedAboutBlockKey,
    BreedAboutBlockKey.APPEARANCE
  >[]

  if (!description) return null

  return (
    <div className={cn([styles.root, className ?? ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={styles.tabs}
      />
      <div className={styles.content}>
        <img
          className={styles.image}
          src={getImageUrl(activeTab)}
          alt=""
        />
        <div className={styles.blocks}>
          <div
            className={cn([styles.block, styles.block_appearance])}
            key={BreedAboutBlockKey.APPEARANCE}
          >
            <h4 className={styles.blockTitle}>{BLOCK_LABELS[BreedAboutBlockKey.APPEARANCE]}</h4>
            <p className={styles.blockText}>{description.appearance}</p>
          </div>
          <div className={styles.blocksGrid}>
            {blocksToDisplay.map((blockKey) => (
              <div key={blockKey} className={styles.block}>
                <div className={styles.blockContent}>
                  <h4 className={styles.blockTitle}>{BLOCK_LABELS[blockKey]}</h4>
                  {description[blockKey].rating != null && (
                    <PawRating
                      value={description[blockKey].rating!}
                      className={styles.rating}
                    />
                  )}
                </div>
                <p className={styles.blockText}>{description[blockKey].text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}
