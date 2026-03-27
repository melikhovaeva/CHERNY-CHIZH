import { CourseConstructorPage } from '@/pages/CourseConstructorPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/cabinet/courses/$courseSlug/constructor',
)({
  component: CourseConstructorPage,
});
