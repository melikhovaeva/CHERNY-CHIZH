import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const DEFAULT_BREED_ID = 'spitz'

export const Route = createFileRoute('/puppies')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/puppies') {
      throw redirect({ to: '/puppies/$breedId', params: { breedId: DEFAULT_BREED_ID } })
    }
  },
  component: () => <Outlet />,
})

