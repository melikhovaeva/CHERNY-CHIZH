import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dogs/$breedId')({
  component: () => <Outlet />,
})

