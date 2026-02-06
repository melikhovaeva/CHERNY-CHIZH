import { PuppiesPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/puppies/$breedId/')({
  component: PuppiesPage,
})
