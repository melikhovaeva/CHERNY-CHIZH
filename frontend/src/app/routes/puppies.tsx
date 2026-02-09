import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { store } from '../redux'

export const Route = createFileRoute('/puppies')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/puppies') {
      const selectedBreedSlug = store.getState().selectedBreed.selectedBreedSlug
      if (selectedBreedSlug) {
        throw redirect({ to: '/puppies/$breedId', params: { breedId: selectedBreedSlug } })
      }
    }
  },
  component: () => <Outlet />,
})

