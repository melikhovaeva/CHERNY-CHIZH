import { CabinetMyCourses } from '@/widgets';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

function CabinetMyCoursesRoute() {
  const navigate = useNavigate();
  return (
    <CabinetMyCourses
      onGoToCourses={() => navigate({ to: '/cabinet/courses' })}
    />
  );
}

export const Route = createFileRoute('/cabinet/my-courses')({
  component: CabinetMyCoursesRoute,
  staticData: { navLabel: 'Мои курсы', navOrder: 1, userOnly: true },
});

