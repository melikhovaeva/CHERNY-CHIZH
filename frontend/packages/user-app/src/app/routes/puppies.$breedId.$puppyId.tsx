import { PuppyDetailsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { puppyApi } from '@/entities/puppy/api/puppy.api'

export const Route = createFileRoute('/puppies/$breedId/$puppyId')({
  loader: async ({ params: { puppyId } }) => {
    const id = Number(puppyId)

    if (Number.isNaN(id)) {
      return null
    }

    const queryPromise = store.dispatch(
      puppyApi.endpoints.getPuppy.initiate(id),
    )

    try {
      await queryPromise
    } finally {
      queryPromise.unsubscribe()
    }

    return null
  },
  component: PuppyDetailsPage,
})
