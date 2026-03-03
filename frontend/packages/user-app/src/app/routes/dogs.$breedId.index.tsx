import { DogsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { setSelectedBreed } from '@/features/selected-breed'
import { breedApi } from '@/entities/breed/api/breed.api'
import { dogApi } from '@/entities/puppy/api/dog.api'

export const Route = createFileRoute('/dogs/$breedId/')({
  loader: async ({ params: { breedId } }) => {
    const breedsPromise = store.dispatch(
      breedApi.endpoints.getBreeds.initiate(),
    )
    const dogsPromise = store.dispatch(
      dogApi.endpoints.getDogsByBreed.initiate({
        breedSlug: breedId,
        page: 1,
      }),
    )

    store.dispatch(setSelectedBreed(breedId))

    try {
      await Promise.all([breedsPromise, dogsPromise])
    } finally {
      breedsPromise.unsubscribe()
      dogsPromise.unsubscribe()
    }

    return null
  },
  component: DogsPage,
})
