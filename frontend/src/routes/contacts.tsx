import { ContactsPage } from '@/pages/ContactsPage/ContactsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
})
