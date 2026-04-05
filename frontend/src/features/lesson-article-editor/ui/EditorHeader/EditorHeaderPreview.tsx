import { cn } from '@/shared/lib/utils';
import styles from './EditorHeader.module.scss';

export interface EditorHeaderPreviewProps {
  lessonTitle: string;
}

/**
 * Шапка как у встроенного редактора урока, без кнопок и без редактирования заголовка.
 */
export function EditorHeaderPreview({ lessonTitle }: EditorHeaderPreviewProps) {
  return (
    <header className={cn([styles.root, styles.root_embedded])}>
      <div className={styles.left}>
        <div className={cn([styles.titleRow, styles.titleRow_embedded])}>
          <span className={styles.titleStatic}>{lessonTitle}</span>
        </div>
      </div>
    </header>
  );
}
