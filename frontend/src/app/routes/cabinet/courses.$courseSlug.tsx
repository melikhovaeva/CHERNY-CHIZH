import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { CourseEditLayout } from '@/pages/CourseEditLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/$courseSlug')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <CourseEditLayout />
    </RoleGuard>
  ),
});
