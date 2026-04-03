import type { ContentBlock } from '@/entities/article';
import { cn } from '@/shared/lib/utils';
import DownIcon from '../../assets/down.svg?react';
import EditIcon from '../../assets/edit.svg?react';
import TrashIcon from '../../assets/trash.svg?react';
import UpIcon from '../../assets/up.svg?react';
import { BlockInsertBar } from '../BlockInsertBar/BlockInsertBar';
import styles from './BlockWrapper.module.scss';

export interface BlockWrapperProps {
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onInsertAfter: (type: ContentBlock['type']) => void;
  children: React.ReactNode;
  /** Показать нижнюю полосу вставки (последний блок тоже может иметь вставку снизу). */
  showInsertBar?: boolean;
}

export function BlockWrapper({
  isFirst,
  isLast,
  isEditing,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertAfter,
  children,
  showInsertBar = true,
}: BlockWrapperProps) {
  return (
    <div className={styles.root} data-editing={isEditing ? '' : undefined}>
      <div className={styles.controls}>
        <button
          type="button"
          className={cn([styles.surfaceBtn, styles.surfaceBtn_edit])}
          onClick={onEdit}
          aria-label="Редактировать блок"
          aria-pressed={isEditing}
          data-editing-active={isEditing ? '' : undefined}
        >
          <EditIcon className={styles.controlIconEdit} aria-hidden />
        </button>
        <button
          type="button"
          className={cn([styles.surfaceBtn, styles.surfaceBtn_move])}
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Переместить вниз"
        >
          <DownIcon className={styles.controlIconMove} aria-hidden />
        </button>
        <button
          type="button"
          className={cn([styles.surfaceBtn, styles.surfaceBtn_move])}
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Переместить вверх"
        >
          <UpIcon className={styles.controlIconMove} aria-hidden />
        </button>
        <button
          type="button"
          className={cn([styles.surfaceBtn, styles.deleteBtn])}
          onClick={onDelete}
          aria-label="Удалить блок"
        >
          <TrashIcon className={styles.controlIconTrash} aria-hidden />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
      {showInsertBar && <BlockInsertBar onInsert={onInsertAfter} />}
    </div>
  );
}
