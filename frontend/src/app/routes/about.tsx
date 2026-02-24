import { AboutPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  staticData: { navLabel: 'О нас', navOrder: 3 },
})

