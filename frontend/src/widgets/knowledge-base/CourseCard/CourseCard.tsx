import { useAppSelector } from '@/app/store';
import type { CourseRead } from '@/entities/course';
import { selectIsAdmin } from '@/entities/session';
import { formatDate, getImageUrl } from '@/shared';
import { DifficultyBadge, Placeholder } from '@/shared/ui/components';
import { Tag } from '@/shared/ui/components/Tag/Tag';
import { Link } from '@tanstack/react-router';
import styles from './CourseCard.module.scss';

const COURSE_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

interface CourseCardProps {
  course: CourseRead;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function CourseCard({
  course,
  variant = 'horizontal',
  className,
}: CourseCardProps) {
  const imageUrl = getImageUrl(course.imagePreview ?? null);
  const dateStr = formatDate(course.updatedAt ?? course.createdAt);
  const isHorizontal = variant === 'horizontal';
  const isAdmin = useAppSelector(selectIsAdmin);

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

  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className={cardClass}
    >
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
            className={[
              styles.description,
              styles.descriptionClamp,
              isHorizontal
                ? styles.descriptionClamp4
                : styles.descriptionClamp2,
            ].join(' ')}
          >
            {course.description}
          </p>
        )}
        <div className={styles.footer}>
          {isHorizontal ? (
            <>
              <span className={styles.date}>{dateStr}</span>
              <span className={styles.actionButton}>{course.actionText}</span>
            </>
          ) : (
            <>
              {isAdmin && course.status && (
                <span className={statusClassName}>{course.status.label}</span>
              )}
              <span className={styles.date}>{dateStr}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
