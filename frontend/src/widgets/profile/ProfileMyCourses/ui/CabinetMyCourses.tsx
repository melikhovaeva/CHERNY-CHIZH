import { useGetMyCoursesQuery } from '@/entities/course';
import { CourseListTemplate } from '@/features/course-list';
import { Button } from '@/shared/ui/components';
import styles from './CabinetMyCourses.module.scss';

interface CabinetMyCoursesProps {
  onGoToCourses?: () => void;
}

export function CabinetMyCourses({ onGoToCourses }: CabinetMyCoursesProps) {
  const { data: myCourses, isLoading } = useGetMyCoursesQuery();

  return (
    <CourseListTemplate
      items={myCourses ?? []}
      mapToCourse={(enrollment) => enrollment.course}
      isLoading={isLoading}
      emptyState={
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <p>У вас пока нет записей на курсы.</p>
            <Button onClick={onGoToCourses}>Перейти к списку курсов</Button>
          </div>
        </div>
      }
    />
  );
}

