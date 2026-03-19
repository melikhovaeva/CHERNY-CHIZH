import type { EntityType } from '@/shared/config/entityLeftBar';
import { getEntityDisplayTitle } from '@/shared/config/entityLeftBar';
import { cn } from '@/shared/lib/utils';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import { Link } from '@tanstack/react-router';
import styles from './LeftBar.module.scss';

export interface LeftBarProps {
  backUrl: string;
  title: string;
  entityType: EntityType;
  children?: React.ReactNode;
}

export const LeftBar = ({
  backUrl,
  title,
  entityType,
  children,
}: LeftBarProps) => {
  const displayTitle = getEntityDisplayTitle(title, entityType);
  const MAX_TITLE_LENGTH = 16;
  const isTruncated = displayTitle.length > MAX_TITLE_LENGTH;
  const truncatedTitle = isTruncated
    ? `${displayTitle.slice(0, MAX_TITLE_LENGTH).trimEnd()}`
    : displayTitle;

  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <Link to={backUrl} className={styles.backLink} aria-label="Назад">
          <ArrowLeftIcon className={styles.backIcon} aria-hidden />
        </Link>
        <h4
          className={cn([styles.title], {
            [styles.titleTruncated]: isTruncated,
          })}
          title={displayTitle}
        >
          {truncatedTitle}
        </h4>
      </div>
      {children != null ? (
        <div className={styles.content}>{children}</div>
      ) : null}
    </aside>
  );
};
