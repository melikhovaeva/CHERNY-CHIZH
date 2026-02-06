import { PuppyDetailsPage } from '@/pages/PuppyDetailsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/puppies/$breedId/$puppyId')({
  component: PuppyDetailsPage,
})
