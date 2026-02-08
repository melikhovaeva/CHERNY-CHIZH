import type { BreedDescription } from '@/entities/breed'
import { Tabs, type Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
import { BreedAboutBlockKey, CARD_LABELS } from '../model/enums'
import styles from './BreedAbout.module.scss'
import { AppearanceCard } from './cards'
import { FeatureCard } from './cards/FeatureCard/FeatureCard'

interface BreedAboutProps {
  tabs: Tab[]
  descriptions: Record<string, BreedDescription>
  className?: string
  action?: React.ReactNode
}

export function BreedAbout({
  tabs,
  descriptions,
  className,
}: BreedAboutProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value ?? '')

  const description = descriptions[activeTab]

  if (!description) return null

  const featureCards = Object.entries(description).filter(([key]) => key !== BreedAboutBlockKey.APPEARANCE)

  return (
    <div className={cn([styles.root, className ?? ''])}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={styles.tabs}
      />
      <div className={styles.content}>
        <AppearanceCard
          title={CARD_LABELS[BreedAboutBlockKey.APPEARANCE]}
          text={description.appearance}
        />
        {featureCards.map(([key, value]) => (
          <FeatureCard
            key={key}
            title={CARD_LABELS[key as BreedAboutBlockKey]}
            text={value.text}
            rating={value.rating}
          />
        ))}
      </div>
    </div >
  )
}
