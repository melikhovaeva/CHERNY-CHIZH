import { HomePage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '../redux'
import { breedApi } from '@/entities/breed/api/breed.api'
import { articleApi } from '@/entities/article/api/article.api'

export const Route = createFileRoute('/')({
  loader: async () => {
    const breedsPromise = store.dispatch(
      breedApi.endpoints.getBreeds.initiate(),
    )
    const homeLibraryPromise = store.dispatch(
      articleApi.endpoints.getHomeLibrary.initiate(),
    )

    try {
      await Promise.all([breedsPromise, homeLibraryPromise])
    } finally {
      breedsPromise.unsubscribe()
      homeLibraryPromise.unsubscribe()
    }

    return null
  },
  component: HomePage,
  staticData: { navLabel: 'Главная', navOrder: 0 },
})

