import { useGetBreedsQuery } from '@/entities/breed/api/breed.api'
import type { BreedDescription } from '@/entities/breed/model/types'
import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import { BreedAbout } from '@/widgets'
import { useMemo } from 'react'
import styles from './BreedAboutSection.module.scss'

export function BreedAboutSection() {
  const { data: breeds } = useGetBreedsQuery()
  const breedTabs: Tab[] = useMemo(
    () =>
      breeds?.map((b) => ({
        id: b.id,
        label: b.name,
        value: b.slug,
      })) ?? [],
    [breeds],
  )

  const descriptions = useMemo<Record<string, BreedDescription>>(
    () =>
      Object.fromEntries(
        (breeds ?? []).map((b) => [b.slug, b.description]),
      ) as Record<string, BreedDescription>,
    [breeds],
  )

  if (!breedTabs.length) return null

  return (
    <section className={cn([styles.root, 'filled secondary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>О породе</h2>
        <BreedAbout
          tabs={breedTabs}
          descriptions={descriptions}
        />
        <Button>Подробнее</Button>
      </div>
    </section>
  )
}
