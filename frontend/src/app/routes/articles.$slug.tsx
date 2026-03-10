import { ArticlePage } from '@/pages/ArticlePage/ArticlePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/$slug')({
  component: ArticlePage,
});
