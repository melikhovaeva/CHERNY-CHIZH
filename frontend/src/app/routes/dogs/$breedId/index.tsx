import { DogsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { setSelectedBreed } from '@/features/selected-breed'
import { breedApi } from '@/entities/breed/api/breed.api'
import { dogApi } from '@/entities/puppy/api/dog.api'

export const Route = createFileRoute('/dogs/$breedId/')({
  loader: async ({ params: { breedId } }) => {
    const breedsPromise = store.dispatch(
      breedApi.endpoints.v1BreedsList.initiate(),
    )
    const dogsPromise = store.dispatch(
      dogApi.endpoints.v1BreedsDogsList.initiate({
        breedSlug: breedId,
        ageGroup: 'adult',
        limit: 20,
        offset: 0,
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

