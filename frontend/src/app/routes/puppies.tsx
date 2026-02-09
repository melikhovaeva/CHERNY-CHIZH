import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAppSelector } from '../redux'

export const Route = createFileRoute('/puppies')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/puppies') {
      throw redirect({ to: '/puppies/$breedId', params: { breedId: useAppSelector((state) => state.selectedBreed.selectedBreedSlug) } })
    }
  },
  component: () => <Outlet />,
})

