import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { CabinetRequests } from '@/widgets/profile/ProfileRequests';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/requests')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <CabinetRequests />
    </RoleGuard>
  ),
  staticData: { navLabel: 'Заявки', navOrder: 3, adminOnly: true },
});
