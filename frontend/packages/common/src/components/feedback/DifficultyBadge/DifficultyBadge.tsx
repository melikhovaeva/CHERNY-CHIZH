import type { JSX } from 'react';
import styles from './DifficultyBadge.module.scss';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};

export interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps): JSX.Element {
  const label = LABELS[difficulty];
  const badgeClass = [styles.badge, className].filter(Boolean).join(' ');

  return (
    <span className={badgeClass}>
      <span>{label}</span>
      <span className={styles.bars} aria-hidden>
        <span className={`${styles.bar} ${styles.barShort}`} />
        <span className={`${styles.bar} ${styles.barMedium}`} />
        <span className={`${styles.bar} ${styles.barTall}`} />
      </span>
    </span>
  );
}
