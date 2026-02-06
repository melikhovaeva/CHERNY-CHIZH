import { PuppiesPage } from '@/pages/PuppiesPage/PuppiesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/puppies/$breedId')({
  component: PuppiesPage,
})

