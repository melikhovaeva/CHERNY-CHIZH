import { DogsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dogs/$breedId/')({
  component: DogsPage,
})
