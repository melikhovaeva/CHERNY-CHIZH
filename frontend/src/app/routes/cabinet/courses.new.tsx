import { CourseCreateEditPage } from '@/pages/CourseCreationPage/CourseCreateEditPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/new')({
  component: CourseCreateEditPage,
});

