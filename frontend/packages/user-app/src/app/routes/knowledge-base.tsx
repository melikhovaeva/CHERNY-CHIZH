import { KnowledgeBasePage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/knowledge-base')({
  component: KnowledgeBasePage,
  staticData: { navLabel: 'База знаний', navOrder: 2 },
})
