import {
  selectSelectedBreedSlug,
  setSelectedBreed,
  useAppDispatch,
  useAppSelector,
} from '@/app/redux'
import { useGetBreedsQuery } from '@/entities/breed/api/breed.api'
import { useGetPuppiesQuery } from '@/entities/puppy/api/puppy.api'
import { getFirstPhotoUrl } from '@/entities/puppy/model/utils'
import { cn } from '@/shared/lib/utils'
import { Button, Card } from '@/shared/ui/components'
import { FilterableGallery } from '@/widgets'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import styles from './PuppiesSection.module.scss'

export function PuppiesSection() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const selectedBreedSlug = useAppSelector(selectSelectedBreedSlug)
  const { data: breeds } = useGetBreedsQuery()
  const { data: puppies } = useGetPuppiesQuery()

  const breedTabs = useMemo(
    () =>
      breeds?.map((breed) => ({
        id: breed.id,
        label: breed.name,
        value: breed.slug,
      })) ?? [],
    [breeds],
  )

  useEffect(() => {
    if (breedTabs.length > 0 && !selectedBreedSlug) {
      dispatch(setSelectedBreed(breedTabs[0].value))
    }
  }, [breedTabs, selectedBreedSlug, dispatch])

  const activeBreed = selectedBreedSlug || (breedTabs[0]?.value ?? '')

  if (!breeds?.length || !puppies) return null

  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши Щенки</h2>
        <FilterableGallery
          tabs={breedTabs}
          items={puppies}
          filterBy="breed"
          activeTab={activeBreed}
          onActiveTabChange={(value) => dispatch(setSelectedBreed(value))}
          getItemKey={(puppy) => puppy.id}
          getFilterValue={(puppy) => puppy.breed.slug}
          renderItem={(puppy) => (
            <Card
              imgUrl={getFirstPhotoUrl(puppy)}
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
