import { useGetCoursesQuery } from '@/entities/course';
import { CourseListTemplate } from '@/features/course-list';
import styles from './ProfileCourses.module.scss';

export function ProfileCourses() {
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
