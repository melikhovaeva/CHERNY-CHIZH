import { KnowledgeBasePage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { articleApi } from '@/entities/article/api/article.api'

export const Route = createFileRoute('/knowledge-base')({
  loader: async () => {
    const articlesPromise = store.dispatch(
      articleApi.endpoints.v1ArticlesList.initiate({
        limit: 12,
        offset: 0,
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
