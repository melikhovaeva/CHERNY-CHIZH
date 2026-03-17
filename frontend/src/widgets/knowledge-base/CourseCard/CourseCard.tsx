import { useAppSelector } from '@/app/store';
import { useEnrollToCourseMutation, type CourseRead } from '@/entities/course';
import { selectIsAdmin } from '@/entities/session';
import { Button, formatDate, getImageUrl } from '@/shared';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import { DifficultyBadge, Placeholder } from '@/shared/ui/components';
import { Tag } from '@/shared/ui/components/Tag/Tag';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import styles from './CourseCard.module.scss';

const COURSE_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

const COURSE_CARD_LABELS = {
  ENROLL: 'Записаться на курс',
  ENROLLING: 'Записываем…',
  GO_TO: 'Перейти на курс',
  ENROLL_SUCCESS: 'Вы успешно записались на курс',
  ENROLL_ERROR: 'Не удалось записаться на курс',
} as const;

interface CourseCardProps {
  course: CourseRead;
  variant?: 'horizontal' | 'vertical';
  className?: string;
  isAccessible?: boolean;
}

export function CourseCard({
  course,
  variant = 'horizontal',
  className,
  isAccessible = false,
}: CourseCardProps) {
  const router = useRouter();
  const imageUrl = getImageUrl(course.imagePreview ?? null);
  const dateStr = formatDate(course.updatedAt ?? course.createdAt);
  const isHorizontal = variant === 'horizontal';
  const isAdmin = useAppSelector(selectIsAdmin);
  const [enrollToCourse, { isLoading: isEnrollLoading }] =
    useEnrollToCourseMutation();

  const toastSuccess = useSuccess();
  const toastError = useError();

  const [localAccessible, setLocalAccessible] = useState(isAccessible);

  useEffect(() => {
    setLocalAccessible(isAccessible);
  }, [isAccessible]);

  const canAccessCourse = isAdmin || localAccessible;

  const handleGoToCourse = useCallback(() => {
    router.navigate({ to: '/courses/$slug', params: { slug: course.slug } });
  }, [router, course.slug]);

  const handleEnroll = useCallback(async () => {
    try {
      await enrollToCourse({ courseEnrollmentCreate: { courseId: course.id } }).unwrap();
      toastSuccess(COURSE_CARD_LABELS.ENROLL_SUCCESS);
      setLocalAccessible(true);
    } catch {
      toastError(COURSE_CARD_LABELS.ENROLL_ERROR);
    }
  }, [enrollToCourse, course.id, toastSuccess, toastError]);

  const cardClass = [
    styles.card,
    isHorizontal ? styles.cardHorizontal : styles.cardVertical,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imageWrapClass = [
    styles.imageWrap,
    isHorizontal ? styles.imageWrapHorizontal : styles.imageWrapVertical,
  ].join(' ');

  const panelClass = [
    styles.panel,
    isHorizontal ? styles.panelHorizontal : styles.panelVertical,
  ].join(' ');

  const statusClassName =
    course.status?.code === COURSE_STATUS.PUBLISHED
      ? `${styles.status} ${styles.statusPublished}`
      : `${styles.status} ${styles.statusUnpublished}`;

  const actionButton = canAccessCourse ? (
    <Button
      variant="primary"
      onClick={handleGoToCourse}
      disabled={isEnrollLoading}
    >
      {COURSE_CARD_LABELS.GO_TO}
    </Button>
  ) : (
    <Button
      variant="primary"
      onClick={handleEnroll}
      disabled={isEnrollLoading}
    >
      {isEnrollLoading ? COURSE_CARD_LABELS.ENROLLING : COURSE_CARD_LABELS.ENROLL}
    </Button>
  );

  const content = (
    <>
      <div className={imageWrapClass}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <Placeholder className={styles.image} />
          </div>
        )}
        {course.difficulty && (
          <div className={styles.difficultyOverlay}>
            <DifficultyBadge difficulty={course.difficulty} />
          </div>
        )}
      </div>
      <div className={panelClass}>
        {!isHorizontal && course.tags.length > 0 && (
          <div className={styles.tagsRow}>
            {course.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        <h4 className={styles.title}>{course.title}</h4>
        {course.description && (
          <p
            className={[styles.description, styles.descriptionClamp].join(' ')}
          >
            {course.description}
          </p>
        )}
        <div className={styles.footer}>
          {isHorizontal ? (
            <>
              <span className={styles.date}>{dateStr}</span>
              <span className={styles.actionButtonWrap}>{actionButton}</span>
            </>
          ) : (
            <>
              {isAdmin && course.status && (
                <span className={statusClassName}>{course.status.label}</span>
              )}
              <span className={styles.date}>{dateStr}</span>
              {actionButton}
            </>
          )}
        </div>
      </div>
    </>
  );

  return <div className={cardClass}>{content}</div>;
}
