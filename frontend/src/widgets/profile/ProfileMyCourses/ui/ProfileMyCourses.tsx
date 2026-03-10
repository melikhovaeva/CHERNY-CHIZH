import { useGetMyCoursesQuery } from '@/entities/course';
import { Button } from '@/shared/ui/components';
import { CourseCard } from '@/widgets/knowledge-base';
import styles from './ProfileMyCourses.module.scss';

interface ProfileMyCoursesProps {
  onGoToCourses?: () => void;
}

export function ProfileMyCourses({ onGoToCourses }: ProfileMyCoursesProps) {
  const { data: myCourses, isLoading } = useGetMyCoursesQuery();

  if (isLoading) {
    return <div>Загружаем ваши курсы…</div>;
  }

  if (!myCourses || myCourses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>У вас пока нет записей на курсы.</p>
        <Button onClick={onGoToCourses}>Перейти к списку курсов</Button>
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {myCourses.map((course) => (
        <CourseCard variant="vertical" key={course.id} course={course.course} />
      ))}
    </div>
  );
}
