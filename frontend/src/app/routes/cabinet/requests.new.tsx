import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { RequestCreateEditPage } from '@/pages/RequestCreateEditPage/RequestCreateEditPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/requests/new')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <RequestCreateEditPage />
    </RoleGuard>
  ),
});
