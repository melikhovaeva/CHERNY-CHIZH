import { CoursePreviewPage } from '@/pages/CoursePreviewPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/$courseSlug/preview')({
  component: CoursePreviewPage,
});
