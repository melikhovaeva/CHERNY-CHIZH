import styles from './ProfileMyCourses.module.scss';
import { Button } from '@/shared/ui/components';
import type { ProfileMyCourseEnrollment } from '../../model/types';

interface ProfileMyCoursesProps {
  myCourses?: ProfileMyCourseEnrollment[] | null;
  isLoading: boolean;
  onGoToCourses?: () => void;
}

export function ProfileMyCourses({
  myCourses,
  isLoading,
  onGoToCourses,
}: ProfileMyCoursesProps) {
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
      {myCourses.map((enrollment) => (
        <div key={enrollment.id} className={styles.courseCard}>
          {enrollment.course.imagePreview && (
            <img
              src={enrollment.course.imagePreview}
              alt={enrollment.course.title}
              className={styles.courseCardImage}
            />
          )}
          <div className={styles.courseCardBody}>
            <div className={styles.courseTags}>
              {enrollment.course.tags.map((tag) => (
                <span key={tag.id} className={styles.courseTag}>
                  {tag.label}
                </span>
              ))}
            </div>
            <h3 className={styles.courseTitle}>{enrollment.course.title}</h3>
            <p className={styles.courseDescription}>
              {enrollment.course.description}
            </p>
            <div className={styles.courseMeta}>
              <span className={styles.courseStatusBadge}>
                {enrollment.status}
              </span>
              {enrollment.progress != null && (
                <span className={styles.courseProgress}>
                  Прогресс: {enrollment.progress}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
