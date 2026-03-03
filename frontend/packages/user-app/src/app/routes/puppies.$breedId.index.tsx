import { PuppiesPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { setSelectedBreed } from '@/features/selected-breed'
import { breedApi } from '@/entities/breed/api/breed.api'
import { puppyApi } from '@/entities/puppy/api/puppy.api'

export const Route = createFileRoute('/puppies/$breedId/')({
  loader: async ({ params: { breedId } }) => {
    const breedsPromise = store.dispatch(
      breedApi.endpoints.getBreeds.initiate(),
    )
    const puppiesPromise = store.dispatch(
      puppyApi.endpoints.getPuppiesByBreed.initiate({
        breedSlug: breedId,
        page: 1,
      }),
    )

    store.dispatch(setSelectedBreed(breedId))

    try {
      await Promise.all([breedsPromise, puppiesPromise])
    } finally {
      breedsPromise.unsubscribe()
      puppiesPromise.unsubscribe()
    }

    return null
  },
  component: PuppiesPage,
})
