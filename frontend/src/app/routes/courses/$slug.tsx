import { CoursePage } from '@/pages/CoursePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/$slug')({
  component: CoursePage,
});

