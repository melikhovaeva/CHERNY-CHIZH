import { DogCreateEditPage } from '@/pages/DogCreateEditPage/DogCreateEditPage';
import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/nursery/new')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <DogCreateEditPage />
    </RoleGuard>
  ),
});
