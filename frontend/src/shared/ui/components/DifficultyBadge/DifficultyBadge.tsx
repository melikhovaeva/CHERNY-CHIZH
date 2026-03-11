import type { JSX } from 'react';
import styles from './DifficultyBadge.module.scss';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};

const DIFFICULTY_FILLED: Record<DifficultyLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const BADGE_MODIFIER_CLASS: Record<DifficultyLevel, string> = {
  beginner: styles.badgeBeginner,
  intermediate: styles.badgeIntermediate,
  advanced: styles.badgeAdvanced,
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
  const badgeClass = [
    styles.badge,
    BADGE_MODIFIER_CLASS[difficulty],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const filledCount = DIFFICULTY_FILLED[difficulty];
  const barHeights = [styles.barShort, styles.barMedium, styles.barTall];

  return (
    <span className={badgeClass}>
      <span>{label}</span>
      <span className={styles.bars} aria-hidden="true">
        {barHeights.map((heightClass, index) => {
          const isFilled = index < filledCount;
          const barClass = [
            styles.bar,
            heightClass,
            isFilled ? styles.barFilled : styles.barEmpty,
          ]
            .filter(Boolean)
            .join(' ');

          return <span key={heightClass} className={barClass} />;
        })}
      </span>
    </span>
  );
}
