import { useGetCoursesQuery } from '@/entities/course';
import { selectIsAdmin } from '@/entities/session';
import { useAppSelector } from '@/app/store';
import { CourseListTemplate } from '@/features/course-list';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import styles from './CabinetCourses.module.scss';

export function CabinetCourses() {
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useAppSelector(selectIsAdmin);

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
      onGoToCreateCourse={isAdmin ? () => navigate({ to: '/cabinet/courses/new' }) : undefined}
      onEditCourse={
        isAdmin
          ? (course) =>
              navigate({
                to: '/cabinet/courses/$courseSlug',
                params: { courseSlug: course.slug },
              })
          : undefined
      }
      emptyState={
        <div className={styles.emptyState}>Пока курсов нет, но скоро будут</div>
      }
    />
  );
}
