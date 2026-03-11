import { useGetCoursesQuery } from '@/entities/course';
import { CourseListTemplate } from '@/features/course-list';
import styles from './CabinetCourses.module.scss';

export function CabinetCourses() {
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();

  return (
    <CourseListTemplate
      items={courses ?? []}
      mapToCourse={(course) => course}
      isLoading={isCoursesLoading}
      emptyState={
        <div className={styles.emptyState}>Пока курсов нет, но скоро будут</div>
      }
    />
  );
}

