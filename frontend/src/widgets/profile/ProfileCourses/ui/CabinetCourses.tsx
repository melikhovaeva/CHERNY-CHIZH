import { useGetCoursesQuery } from '@/entities/course';
import { CourseListTemplate } from '@/features/course-list';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import styles from './CabinetCourses.module.scss';

export function CabinetCourses() {
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const isNestedRoute =
    location.pathname.startsWith('/cabinet/courses/') &&
    location.pathname !== '/cabinet/courses';

  if (isNestedRoute) {
    return <Outlet />;
  }

  return (
    <CourseListTemplate
      items={courses ?? []}
      mapToCourse={(course) => course}
      isLoading={isCoursesLoading}
      onGoToCreateCourse={() => navigate({ to: '/cabinet/courses/new' })}
      emptyState={
        <div className={styles.emptyState}>Пока курсов нет, но скоро будут</div>
      }
    />
  );
}
