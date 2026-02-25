import { ContactsPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
  staticData: { navLabel: 'Контакты', navOrder: 4 },
})
