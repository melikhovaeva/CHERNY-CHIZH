import { BREED_OPTIONS } from '@/entities/breed'
import { getPuppyMainPhotoUrl } from '@/entities/puppy'
import { useGetPuppiesQuery } from '@/entities/puppy/api/puppy.api'
import type { Tab } from '@/features/tabs-filter'
import { cn } from '@/shared/lib/utils'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import styles from './PuppiesSection.module.scss'

const breedTabs: Tab[] = BREED_OPTIONS.map((option, index) => ({
  uid: index + 1,
  label: option.label,
  value: option.value,
}))


export function PuppiesSection() {
  const router = useRouter()
  const [activeBreed, setActiveBreed] = useState<string>(
    breedTabs[0]?.value ?? '',
  )
  const { data: puppies } = useGetPuppiesQuery()

  if (!puppies) return null
  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши Щенки</h2>
        <FilterableGallery
          tabs={breedTabs}
          items={puppies}
          filterBy="breed"
          onActiveTabChange={setActiveBreed}
          renderItem={(puppy) => (
            <Card
              imgUrl={getPuppyMainPhotoUrl(puppy)}
              subtitle={puppy.name}
            />
          )}
          className={styles.gallery}
        />
        <div className={styles.buttonContainer}>
          <Button
            onClick={() => {
              const breedId = activeBreed || breedTabs[0]?.value
              if (!breedId) return
              router.navigate({ to: '/puppies/$breedId', params: { breedId } })
            }}
          >
            Смотреть всех
          </Button>
        </div>
      </div>
    </section>
  )
}
