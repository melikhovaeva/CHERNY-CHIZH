import { KnowledgeBasePage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '../redux'
import { articleApi } from '@/entities/article/api/article.api'

export const Route = createFileRoute('/knowledge-base')({
  loader: async () => {
    const articlesPromise = store.dispatch(
      articleApi.endpoints.getArticlesList.initiate({
        page: 1,
        pageSize: 12,
      }),
    )

    try {
      await articlesPromise
    } finally {
      articlesPromise.unsubscribe()
    }

    return null
  },
  component: KnowledgeBasePage,
  staticData: { navLabel: 'База знаний', navOrder: 2 },
})
