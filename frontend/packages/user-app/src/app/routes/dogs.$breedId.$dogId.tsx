import { DogDetailsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dogs/$breedId/$dogId')({
  component: DogDetailsPage,
})
