import { cn } from '@/shared/lib/utils';
import type { CSSProperties } from 'react';
import styles from './Skeleton.module.scss';

type SkeletonVariant = 'text' | 'rect' | 'avatar';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  inline?: boolean;
  className?: string;
}

const toCssSize = (value?: string | number): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

export const Skeleton = ({
  variant = 'rect',
  width,
  height,
  lines = 1,
  inline = false,
  className,
}: SkeletonProps) => {
  const baseStyle: CSSProperties = {};
  const w = toCssSize(width);
  const h = toCssSize(height);

  if (w) baseStyle.width = w;
  if (h) baseStyle.height = h;

  if (variant === 'text' && lines > 1) {
    const lineWidths = Array.from({ length: lines }).map((_, index) => {
      if (index === lines - 1) return '60%';
      if (index === lines - 2) return '80%';
      return '100%';
    });

    return (
      <div
        className={cn([
          styles.skeletonText,
          inline ? styles.skeletonText_inline : '',
          className || '',
        ])}
        aria-hidden="true"
      >
        {lineWidths.map((lineWidth, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={styles.skeletonText__line}
            style={{ ...baseStyle, width: lineWidth }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={cn([
        styles.skeleton,
        inline ? styles.skeleton_inline : '',
        variant === 'avatar' ? styles.skeleton_circle : '',
        className || '',
      ])}
      style={baseStyle}
      aria-hidden="true"
    />
  );
};
