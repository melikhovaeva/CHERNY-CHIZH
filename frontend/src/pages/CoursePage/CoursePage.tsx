import { useAppSelector } from '@/app/store';
import {
  isCourseAccessible,
  useGetCourseQuery,
  useGetCoursesQuery,
  useGetMyCoursesQuery,
} from '@/entities/course';
import { selectIsAdmin } from '@/entities/session';
import { CoursePreviewTemplate } from '@/widgets';
import { Link, useParams } from '@tanstack/react-router';
import { DifficultyBadge, Placeholder } from '@/shared/ui/components';
import { Tag } from '@/shared/ui/components/Tag/Tag';
import { getImageUrl } from '@/shared/lib/utils';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import styles from './CoursePage.module.scss';

const KNOWLEDGE_BASE_PATH = '/knowledge-base' as const;

export const CoursePage = () => {
  const { slug } = useParams({ from: '/courses/$slug' });
  const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } =
    useGetCoursesQuery();
  const { data: myCourses, isLoading: isMyCoursesLoading } =
    useGetMyCoursesQuery();
  const isAdmin = useAppSelector(selectIsAdmin);

  const course = courses?.find((c) => c.slug === slug);

  const canAccessCourse =
    !!course &&
    isCourseAccessible({
      slug,
      enrollments: myCourses,
      isAdmin,
    });

  const {
    data: courseDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetCourseQuery(
    { id: course?.id ?? 0 },
    { skip: !course || !canAccessCourse },
  );

  const isLoading =
    isCoursesLoading || isMyCoursesLoading || (canAccessCourse && isDetailLoading);

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.inner}>
          <div className={styles.skeletonBack} />
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonWorkspace} />
        </div>
      </div>
    );
  }

  if (isCoursesError || !course) {
    return (
      <div className={styles.root}>
        <div className={styles.inner}>
          <p className={styles.error}>Курс не найден</p>
        </div>
      </div>
    );
  }

  if (!canAccessCourse) {
    return (
      <div className={styles.root}>
        <div className={styles.inner}>
          <p className={styles.error}>У вас нет доступа к этому курсу</p>
        </div>
      </div>
    );
  }

  if (isDetailError || !courseDetail) {
    return (
      <div className={styles.root}>
        <div className={styles.inner}>
          <p className={styles.error}>Не удалось загрузить программу курса</p>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(courseDetail.imagePreview ?? null);
  const displayTitle = courseDetail.title;
  const displayDescription = courseDetail.description;

  return (
    <article className={styles.root}>
      <div className={styles.inner}>
        <Link
          to={KNOWLEDGE_BASE_PATH}
          className={styles.backLink}
          aria-label="Назад к базе знаний"
        >
          <ArrowLeftIcon className={styles.backIcon} aria-hidden />
          <span>К базе знаний</span>
        </Link>

        <header className={styles.hero}>
          <div className={styles.heroVisual}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className={styles.heroImage}
              />
            ) : (
              <Placeholder className={styles.heroPlaceholder} />
            )}
            {courseDetail.difficulty ? (
              <div className={styles.difficultyBadge}>
                <DifficultyBadge difficulty={courseDetail.difficulty} />
              </div>
            ) : null}
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{displayTitle}</h1>
            {displayDescription ? (
              <p className={styles.description}>{displayDescription}</p>
            ) : null}
            {courseDetail.tags.length > 0 ? (
              <ul className={styles.tags}>
                {courseDetail.tags.map((tag) => (
                  <li key={tag.id}>
                    <Tag tag={tag} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <section className={styles.program} aria-label="Программа курса">
          <CoursePreviewTemplate
            courseId={courseDetail.id}
            persistenceCourseSlug={slug}
            embeddedSteps={courseDetail.steps}
            learnerMode
          />
        </section>
      </div>
    </article>
  );
};
