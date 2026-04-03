import { cn } from '@/shared/lib/utils';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import { Link } from '@tanstack/react-router';
import styles from './LeftBar.module.scss';

export type LeftBarProps =
  | {
      hideHeader: true;
      children?: React.ReactNode;
    }
  | {
      hideHeader?: false;
      backUrl: string;
      title: string;
      children?: React.ReactNode;
    };

export const LeftBar = (props: LeftBarProps) => {
  if (props.hideHeader) {
    const { children } = props;
    return (
      <aside className={styles.root}>
        {children != null ? (
          <div className={styles.content}>{children}</div>
        ) : null}
      </aside>
    );
  }

  const { backUrl, title, children } = props;
  const MAX_TITLE_LENGTH = 16;
  const isTruncated = title.length > MAX_TITLE_LENGTH;
  const truncatedTitle = isTruncated
    ? `${title.slice(0, MAX_TITLE_LENGTH).trimEnd()}`
    : title;

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
          title={title}
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
