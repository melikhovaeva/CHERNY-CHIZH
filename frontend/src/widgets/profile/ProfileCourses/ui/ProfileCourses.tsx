import { useGetCoursesQuery } from '@/entities/course';
import { CourseCard } from '@/widgets/knowledge-base/CourseCard/CourseCard';
import styles from './ProfileCourses.module.scss';

export function ProfileCourses() {
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();

  if (isCoursesLoading) {
    return <div>Загружаем ваши курсы…</div>;
  }

  if (!courses || courses.length === 0) {
    return <div>У вас пока нет записей на курсы.</div>;
  }

  return (
    <div className={styles.cardsGrid}>
      {courses.map((course) => (
        <CourseCard variant="vertical" key={course.id} course={course} />
      ))}
    </div>
  );
}
