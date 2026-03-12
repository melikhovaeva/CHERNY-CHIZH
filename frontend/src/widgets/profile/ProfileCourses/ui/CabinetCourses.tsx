import { useGetCoursesQuery } from '@/entities/course';
import { CourseListTemplate } from '@/features/course-list';
import { useNavigate } from '@tanstack/react-router';
import styles from './CabinetCourses.module.scss';

export function CabinetCourses() {
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();
  const navigate = useNavigate();

  return (
    <CourseListTemplate
      items={courses ?? []}
      mapToCourse={(course) => course}
      isLoading={isCoursesLoading}
      onGoToCreateCourse={() => navigate({ to: '/courses/new' })}
      emptyState={
        <div className={styles.emptyState}>Пока курсов нет, но скоро будут</div>
      }
    />
  );
}
