import { useGetCoursesQuery } from '@/entities/course';
import { useParams } from '@tanstack/react-router';
import styles from './CoursePage.module.scss';

export const CoursePage = () => {
  const { slug } = useParams({ from: '/courses/$slug' });
  const { data: courses, isLoading, isError } = useGetCoursesQuery();
  const course = courses?.find((c) => c.slug === slug);

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonContent} />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <p className={styles.error}>Курс не найден</p>
        </div>
      </div>
    );
  }

  return (
    <article className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.title}>{course.title}</h1>
        {course.description && (
          <p className={styles.description}>{course.description}</p>
        )}
      </div>
    </article>
  );
};
