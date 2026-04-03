import { DropdownMenu } from '@/shared/ui/components/DropdownMenu';
import { cn } from '@/shared/lib/utils';
import EditPencilSvg from '@/shared/ui/assets/edit.svg?react';
import ArrowLeftSvg from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import { useRef, useState } from 'react';
import styles from './EditorHeader.module.scss';

export interface EditorHeaderProps {
  variant?: 'page' | 'embedded';
  lessonTitle: string;
  isDirty: boolean;
  isSaving: boolean;
  isPublished: boolean;
  onTitleChange: (title: string) => void;
  onSave: () => void | Promise<void>;
  onPublish: () => void | Promise<void>;
  onUnpublish: () => void | Promise<void>;
  onBack?: () => void;
  onDeleteLesson?: () => void;
}

/** Иконка «синхронизация / есть несохранённое» (две стрелки). */
function SyncStatusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  );
}

/** Шестерёнка для тёмной кнопки (белая заливка). */
function GearIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
      />
    </svg>
  );
}

export function EditorHeader({
  variant = 'page',
  lessonTitle,
  isDirty,
  isSaving,
  isPublished,
  onTitleChange,
  onSave,
  onPublish,
  onUnpublish,
  onBack,
  onDeleteLesson,
}: EditorHeaderProps) {
  const [gearOpen, setGearOpen] = useState(false);
  const gearBtnRef = useRef<HTMLButtonElement>(null);
  const embedded = variant === 'embedded';

  const primaryLabel = (() => {
    if (!isPublished) return 'Опубликовать изменения';
    if (isDirty) return 'Сохранить изменения';
    return 'Изменения сохранены';
  })();

  const primaryDisabled = isSaving || (isPublished && !isDirty);

  const handlePrimary = () => {
    if (!isPublished) void onPublish();
    else if (isDirty) void onSave();
  };

  return (
    <header
      className={cn([
        styles.root,
        embedded ? styles.root_embedded : styles.root_page,
      ])}
    >
      <div className={styles.left}>
        {!embedded && onBack && (
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Назад к конструктору"
          >
            <ArrowLeftSvg className={styles.backIcon} aria-hidden />
          </button>
        )}
        <div
          className={cn([
            styles.titleRow,
            embedded ? styles.titleRow_embedded : '',
          ])}
        >
          <input
            className={styles.titleInput}
            type="text"
            value={lessonTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            aria-label="Название урока"
          />
          <span className={styles.pencilWrap} aria-hidden>
            <EditPencilSvg className={styles.pencilIcon} />
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <span
          className={styles.syncWrap}
          title={
            isDirty
              ? 'Есть несохранённые изменения'
              : 'Изменения сохранены'
          }
        >
          <SyncStatusIcon
            className={cn([
              styles.syncIcon,
              isDirty ? styles.syncIcon_dirty : styles.syncIcon_clean,
            ])}
          />
        </span>
        <div className={styles.gearWrap}>
          <button
            type="button"
            ref={gearBtnRef}
            className={styles.gearBtnDark}
            aria-label="Дополнительные действия"
            aria-expanded={gearOpen}
            onClick={() => setGearOpen((o) => !o)}
          >
            <GearIcon />
          </button>
          <DropdownMenu
            isOpen={gearOpen}
            onClose={() => setGearOpen(false)}
            anchorRef={gearBtnRef}
            className={styles.dropdown}
          >
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                setGearOpen(false);
                void onSave();
              }}
              disabled={isSaving || !isDirty}
            >
              Сохранить
            </button>
            {isPublished && (
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setGearOpen(false);
                  void onUnpublish();
                }}
              >
                Снять с публикации
              </button>
            )}
            <button type="button" className={styles.dropdownItem} disabled>
              Дублировать
            </button>
            {onDeleteLesson && (
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={() => {
                  setGearOpen(false);
                  onDeleteLesson();
                }}
              >
                Удалить урок
              </button>
            )}
          </DropdownMenu>
        </div>
        <button
          type="button"
          className={styles.publishBtn}
          onClick={handlePrimary}
          disabled={primaryDisabled}
        >
          {isSaving ? 'Сохранение…' : primaryLabel}
        </button>
      </div>
    </header>
  );
}
