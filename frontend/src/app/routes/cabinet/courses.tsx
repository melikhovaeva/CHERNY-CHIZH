import { CabinetCourses } from '@/widgets';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses')({
  component: CabinetCourses,
  staticData: { navLabel: 'Курсы', navOrder: 0 },
});

