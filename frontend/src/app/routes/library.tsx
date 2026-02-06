import { LibraryPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/library')({
  component: LibraryPage,
})

