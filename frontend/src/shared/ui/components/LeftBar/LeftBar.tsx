import type { EntityType } from '@/shared/config/entityLeftBar';
import { getEntityDisplayTitle } from '@/shared/config/entityLeftBar';
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

  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <Link to={backUrl} className={styles.backLink} aria-label="Назад">
          <ArrowLeftIcon className={styles.backIcon} aria-hidden />
        </Link>
        <h2 className={styles.title}>{displayTitle}</h2>
      </div>
      {children != null ? (
        <div className={styles.content}>{children}</div>
      ) : null}
    </aside>
  );
};
