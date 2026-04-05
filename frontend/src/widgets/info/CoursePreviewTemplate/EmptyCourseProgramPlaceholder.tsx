import styles from './EmptyCourseProgramPlaceholder.module.scss';

function IllustrationIcon() {
  return (
    <svg
      className={styles.illustration}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="56" fill="currentColor" className={styles.illustrationBg} />

      {/* Book body */}
      <rect x="30" y="35" width="60" height="52" rx="6" fill="currentColor" className={styles.illustrationCard} />

      {/* Book spine */}
      <rect x="30" y="35" width="8" height="52" rx="3" fill="currentColor" className={styles.illustrationSpine} />

      {/* Lines (text rows) */}
      <rect x="46" y="48" width="32" height="4" rx="2" fill="currentColor" className={styles.illustrationLine} />
      <rect x="46" y="58" width="24" height="4" rx="2" fill="currentColor" className={styles.illustrationLine} />
      <rect x="46" y="68" width="28" height="4" rx="2" fill="currentColor" className={styles.illustrationLine} />

      {/* Clock overlay */}
      <circle cx="82" cy="78" r="18" fill="currentColor" className={styles.illustrationClockBg} />
      <circle cx="82" cy="78" r="14" fill="currentColor" className={styles.illustrationClockFace} />
      <line x1="82" y1="70" x2="82" y2="78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={styles.illustrationClockHand} />
      <line x1="82" y1="78" x2="87" y2="83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={styles.illustrationClockHand} />
      <circle cx="82" cy="78" r="2" fill="currentColor" className={styles.illustrationClockDot} />
    </svg>
  );
}

export interface EmptyCourseProgramPlaceholderProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = 'Программа готовится';
const DEFAULT_DESCRIPTION =
  'Уроки ещё не опубликованы. Загляните сюда немного позже — скоро здесь появятся материалы.';

export function EmptyCourseProgramPlaceholder({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: EmptyCourseProgramPlaceholderProps) {
  return (
    <div className={styles.root}>
      <IllustrationIcon />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
