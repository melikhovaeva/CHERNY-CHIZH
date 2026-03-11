import { CabinetSettings } from '@/widgets';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/settings')({
  component: CabinetSettings,
  staticData: { navLabel: 'Настройки', navOrder: 2 },
});
