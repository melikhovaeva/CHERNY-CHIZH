import { CourseCreateEditPage } from '@/pages/CourseCreationPage/CourseCreateEditPage';
import { ProtectedRoute } from '@/features/session';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/new')({
  component: () => (
    <ProtectedRoute>
      <CourseCreateEditPage />
    </ProtectedRoute>
  ),
});

