import { CoursePage } from '@/pages/CoursePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/$slug')({
  component: CoursePage,
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
});

