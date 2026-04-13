import { CabinetArticles } from '@/widgets';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/articles')({
  component: CabinetArticles,
  staticData: { navLabel: 'Статьи', navOrder: 3 },
});
