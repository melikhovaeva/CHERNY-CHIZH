import { CabinetNursery } from '@/widgets/profile/ProfileNursery/ui/CabinetNursery';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/nursery')({
  component: CabinetNursery,
  staticData: { navLabel: 'Питомник', navOrder: 2 },
});
