import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { CourseCreateEditPage } from '@/pages/CourseCreationPage/CourseCreateEditPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/$courseSlug')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <CourseCreateEditPage />
    </RoleGuard>
  ),
});
