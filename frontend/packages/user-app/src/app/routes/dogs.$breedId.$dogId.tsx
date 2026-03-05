import { DogDetailsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { puppyApi } from '@/entities/puppy/api/puppy.api'

export const Route = createFileRoute('/dogs/$breedId/$dogId')({
  loader: async ({ params: { dogId } }) => {
    const id = Number(dogId)

    if (Number.isNaN(id)) {
      return null
    }

    const queryPromise = store.dispatch(
      puppyApi.endpoints.v1DogsRetrieve.initiate({ id, pk: id }),
    )

    try {
      await queryPromise
    } finally {
      queryPromise.unsubscribe()
    }

    return null
  },
  component: DogDetailsPage,
})
