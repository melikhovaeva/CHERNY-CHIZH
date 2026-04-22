import { MyRequests } from '@/widgets/profile/ProfileMyRequests';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/my-requests')({
  component: MyRequests,
  staticData: { navLabel: 'Мои заявки', navOrder: 4 },
});
