import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { store } from '@/app/store'

export const Route = createFileRoute('/dogs')({
  staticData: { navLabel: 'Собаки', navOrder: 2 },
  beforeLoad: ({ location }) => {
    if (location.pathname === '/dogs') {
      const selectedBreedSlug = store.getState().selectedBreed.selectedBreedSlug
      if (selectedBreedSlug) {
        throw redirect({ to: '/dogs/$breedId', params: { breedId: selectedBreedSlug } })
      }
    }
  },
  component: () => <Outlet />,
})
