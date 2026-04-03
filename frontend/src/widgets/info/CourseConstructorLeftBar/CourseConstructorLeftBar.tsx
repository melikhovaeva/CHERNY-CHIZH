import type {
  ConstructorLesson,
  ConstructorStage,
  ConstructorTask,
} from '@/entities/course';
import { cn } from '@/shared/lib/utils';
import { Button, LeftBar } from '@/shared/ui';
import { DropdownMenu } from '@/shared/ui/components';
import ChevronDownSvg from '@/shared/ui/components/Select/assets/chevron-down.svg?react';
import UnsyncedIcon from './assets/unsynced.svg?react';
import { useEffect, useRef, useState } from 'react';
import styles from './CourseConstructorLeftBar.module.scss';

const ADD_FIRST_STAGE_LABEL = 'Добавить ступень';

const EMPTY_PREVIEW_HINT =
  'В программе курса пока нет уроков. Добавьте ступени и уроки в конструкторе.';

export interface CourseConstructorLeftBarProps {
  stages: ConstructorStage[];
  activeStageId: string | null;
  activeLessonId: string | null;
  activeTaskId: string | null;
  /** Только навигация: без сохранения, переименований и удаления. */
  readOnly?: boolean;
  unsyncedIds?: Set<string>;
  hasChanges?: boolean;
  isSaving?: boolean;
  unsavedCount?: number;
  onSave?: () => void;
  onSelectLesson: (stageId: string, lessonId: string) => void;
  onSelectTask: (stageId: string, lessonId: string, taskId: string) => void;
  onAddStage: () => void;
  onAddLesson: (stageId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onDeleteLesson: (stageId: string, lessonId: string) => void;
  onAddTask: (stageId: string, lessonId: string) => void;
  onDeleteTask: (stageId: string, lessonId: string, taskId: string) => void;
  onRenameStage: (stageId: string, newTitle: string) => void;
  onRenameLesson: (
    stageId: string,
    lessonId: string,
    newTitle: string,
  ) => void;
  onRenameTask: (
    stageId: string,
    lessonId: string,
    taskId: string,
    newTitle: string,
  ) => void;
}

export const CourseConstructorLeftBar = ({
  stages,
  activeStageId,
  activeLessonId,
  activeTaskId,
  readOnly = false,
  unsyncedIds,
  hasChanges,
  isSaving,
  unsavedCount,
  onSave,
  onSelectLesson,
  onSelectTask,
  onAddStage,
  onAddLesson,
  onDeleteStage,
  onDeleteLesson,
  onAddTask,
  onDeleteTask,
  onRenameStage,
  onRenameLesson,
  onRenameTask,
}: CourseConstructorLeftBarProps) => {
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [collapsedStageIds, setCollapsedStageIds] = useState<Set<string>>(
    new Set(),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const moreBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggleCollapse = (stageId: string) => {
    setCollapsedStageIds((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  useEffect(() => {
    setCollapsedStageIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of prev) {
        const stage = stages.find((s) => s.id === id);
        if (!stage || stage.lessons.length === 0) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [stages]);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingValue(currentTitle);
    setOpenMoreMenuId(null);
  };

  const commitEditing = (
    stageId: string,
    lessonId?: string,
    taskId?: string,
  ) => {
    const trimmed = editingValue.trim();
    if (trimmed) {
      if (taskId && lessonId) {
        onRenameTask(stageId, lessonId, taskId, trimmed);
      } else if (lessonId) {
        onRenameLesson(stageId, lessonId, trimmed);
      } else {
        onRenameStage(stageId, trimmed);
      }
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <LeftBar hideHeader>
      <div className={styles.stageList}>
        {stages.length === 0 ? (
          readOnly ? (
            <p className={styles.emptyReadonlyHint}>{EMPTY_PREVIEW_HINT}</p>
          ) : (
            <div className={styles.emptyStageTree}>
              <button
                type="button"
                className={styles.emptyStageCta}
                onClick={onAddStage}
              >
                <span className={styles.emptyStageLabel}>
                  {ADD_FIRST_STAGE_LABEL}
                </span>
                <span className={styles.emptyStagePlusBadge} aria-hidden>
                  <span className={styles.addBtnIcon}>+</span>
                </span>
              </button>
            </div>
          )
        ) : (
          stages.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            readOnly={readOnly}
            isLast={index === stages.length - 1}
            isCollapsed={collapsedStageIds.has(stage.id)}
            unsyncedIds={unsyncedIds}
            activeLessonId={
              activeStageId === stage.id ? activeLessonId : null
            }
            activeTaskId={
              activeStageId === stage.id ? activeTaskId : null
            }
            editingId={editingId}
            editingValue={editingValue}
            onEditingValueChange={setEditingValue}
            onStartEditing={startEditing}
            onCommitEditing={commitEditing}
            onCancelEditing={cancelEditing}
            onToggleCollapse={() => toggleCollapse(stage.id)}
            onSelectLesson={(lessonId) =>
              onSelectLesson(stage.id, lessonId)
            }
            onSelectTask={(lessonId, taskId) =>
              onSelectTask(stage.id, lessonId, taskId)
            }
            onDeleteLesson={(lessonId) =>
              onDeleteLesson(stage.id, lessonId)
            }
            onAddTask={(lessonId) => onAddTask(stage.id, lessonId)}
            onDeleteTask={(lessonId, taskId) =>
              onDeleteTask(stage.id, lessonId, taskId)
            }
            moreBtnRef={(el) => {
              moreBtnRefs.current[stage.id] = el;
            }}
            isMoreMenuOpen={openMoreMenuId === stage.id}
            onToggleMoreMenu={() =>
              setOpenMoreMenuId((prev) =>
                prev === stage.id ? null : stage.id,
              )
            }
            onCloseMoreMenu={() => setOpenMoreMenuId(null)}
            moreMenuAnchor={{
              current: moreBtnRefs.current[stage.id] ?? null,
            }}
            onAddLesson={() => {
              onAddLesson(stage.id);
              setOpenMoreMenuId(null);
            }}
            onAddStage={onAddStage}
            onDeleteStage={() => {
              onDeleteStage(stage.id);
              setOpenMoreMenuId(null);
            }}
          />
        ))
        )}
      </div>

      {!readOnly && onSave && (
        <div className={styles.saveBar}>
          {hasChanges && (
            <span className={styles.unsavedHint}>
              Несохранённые изменения ({unsavedCount})
            </span>
          )}
          <Button
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className={styles.saveBtn}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </LeftBar>
  );
};

// === StageCard ===

interface StageCardProps {
  stage: ConstructorStage;
  readOnly: boolean;
  isLast: boolean;
  isCollapsed: boolean;
  unsyncedIds?: Set<string>;
  activeLessonId: string | null;
  activeTaskId: string | null;
  editingId: string | null;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onStartEditing: (id: string, currentTitle: string) => void;
  onCommitEditing: (
    stageId: string,
    lessonId?: string,
    taskId?: string,
  ) => void;
  onCancelEditing: () => void;
  onToggleCollapse: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectTask: (lessonId: string, taskId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddTask: (lessonId: string) => void;
  onDeleteTask: (lessonId: string, taskId: string) => void;
  moreBtnRef: (el: HTMLButtonElement | null) => void;
  isMoreMenuOpen: boolean;
  onToggleMoreMenu: () => void;
  onCloseMoreMenu: () => void;
  moreMenuAnchor: { current: HTMLElement | null };
  onAddLesson: () => void;
  onAddStage: () => void;
  onDeleteStage: () => void;
}

function StageCard({
  stage,
  readOnly,
  isLast,
  isCollapsed,
  unsyncedIds,
  activeLessonId,
  activeTaskId,
  editingId,
  editingValue,
  onEditingValueChange,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onToggleCollapse,
  onSelectLesson,
  onSelectTask,
  onDeleteLesson,
  onAddTask,
  onDeleteTask,
  moreBtnRef,
  isMoreMenuOpen,
  onToggleMoreMenu,
  onCloseMoreMenu,
  moreMenuAnchor,
  onAddLesson,
  onAddStage,
  onDeleteStage,
}: StageCardProps) {
  const isEditingStage = !readOnly && editingId === stage.id;
  const isUnsynced = unsyncedIds?.has(stage.id) ?? false;

  return (
    <div className={styles.stageBlock}>
      <div className={styles.stageCard}>
        <div className={styles.stageHeader}>
          {isEditingStage ? (
            <InlineEditor
              value={editingValue}
              onChange={onEditingValueChange}
              onCommit={() => onCommitEditing(stage.id)}
              onCancel={onCancelEditing}
              className={styles.stageInlineEditor}
            />
          ) : (
            <div className={styles.stageHeaderTitle}>
              <span className={styles.stageLabel}>{stage.label}</span>
              <span className={styles.stageTitle}>{stage.title}</span>
            </div>
          )}

          <div className={styles.headerActions}>
            {!readOnly && isUnsynced && (
              <span title="Не сохранено">
                <UnsyncedIcon className={styles.unsyncedIcon} />
              </span>
            )}

            {stage.lessons.length > 0 && (
              <button
                type="button"
                className={styles.chevronBtn}
                onClick={onToggleCollapse}
                aria-label={
                  isCollapsed ? 'Развернуть ступень' : 'Свернуть ступень'
                }
              >
                <ChevronDownSvg
                  className={cn([styles.chevronIcon], {
                    [styles.chevronIconCollapsed]: isCollapsed,
                  })}
                />
              </button>
            )}

            {!readOnly && (
              <div className={styles.moreWrapper}>
                <button
                  type="button"
                  ref={moreBtnRef}
                  className={styles.moreBtn}
                  onClick={onToggleMoreMenu}
                  aria-label="Действия со ступенью"
                >
                  <span className={styles.moreDot} />
                  <span className={styles.moreDot} />
                  <span className={styles.moreDot} />
                </button>
                <DropdownMenu
                  isOpen={isMoreMenuOpen}
                  onClose={onCloseMoreMenu}
                  anchorRef={moreMenuAnchor}
                  className={styles.dropdown}
                >
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      onStartEditing(stage.id, stage.title);
                      onCloseMoreMenu();
                    }}
                  >
                    Переименовать
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={onAddLesson}
                  >
                    Добавить урок
                  </button>
                  <button
                    type="button"
                    className={cn([
                      styles.dropdownItem,
                      styles.dropdownItemDanger,
                    ])}
                    onClick={onDeleteStage}
                  >
                    Удалить
                  </button>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && stage.lessons.length > 0 && (
          <LessonsList
            stageId={stage.id}
            readOnly={readOnly}
            lessons={stage.lessons}
            activeLessonId={activeLessonId}
            activeTaskId={activeTaskId}
            unsyncedIds={unsyncedIds}
            editingId={editingId}
            editingValue={editingValue}
            onEditingValueChange={onEditingValueChange}
            onStartEditing={onStartEditing}
            onCommitEditing={onCommitEditing}
            onCancelEditing={onCancelEditing}
            onSelect={onSelectLesson}
            onSelectTask={onSelectTask}
            onDelete={onDeleteLesson}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        )}
      </div>

      {!readOnly && isLast && (
        <div className={styles.separator}>
          <div className={styles.separatorLine} />
          <button
            type="button"
            className={styles.addBtn}
            onClick={onAddStage}
            aria-label="Добавить ступень"
          >
            <span className={styles.addBtnIcon}>+</span>
          </button>
        </div>
      )}
    </div>
  );
}

// === InlineEditor ===

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  className?: string;
}

function InlineEditor({
  value,
  onChange,
  onCommit,
  onCancel,
  className,
}: InlineEditorProps) {
  return (
    <input
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      type="text"
      className={cn([styles.inlineInput, className ?? ''])}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit();
        if (e.key === 'Escape') onCancel();
      }}
      onBlur={onCommit}
    />
  );
}

// === LessonsList ===

interface LessonsListProps {
  stageId: string;
  readOnly: boolean;
  lessons: ConstructorLesson[];
  activeLessonId: string | null;
  activeTaskId: string | null;
  unsyncedIds?: Set<string>;
  editingId: string | null;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onStartEditing: (id: string, currentTitle: string) => void;
  onCommitEditing: (
    stageId: string,
    lessonId?: string,
    taskId?: string,
  ) => void;
  onCancelEditing: () => void;
  onSelect: (lessonId: string) => void;
  onSelectTask: (lessonId: string, taskId: string) => void;
  onDelete: (lessonId: string) => void;
  onAddTask: (lessonId: string) => void;
  onDeleteTask: (lessonId: string, taskId: string) => void;
}

function LessonsList({
  stageId,
  readOnly,
  lessons,
  activeLessonId,
  activeTaskId,
  unsyncedIds,
  editingId,
  editingValue,
  onEditingValueChange,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onSelect,
  onSelectTask,
  onDelete,
  onAddTask,
  onDeleteTask,
}: LessonsListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [collapsedLessonIds, setCollapsedLessonIds] = useState<Set<string>>(
    new Set(),
  );
  const menuBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggleLessonCollapse = (lessonId: string) => {
    setCollapsedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  return (
    <div className={styles.lessonList}>
      {lessons.map((lesson) => {
        const isCollapsed = collapsedLessonIds.has(lesson.id);
        return (
          <div key={lesson.id} className={styles.lessonGroup}>
            <LessonItem
              stageId={stageId}
              readOnly={readOnly}
              lesson={lesson}
              isActive={activeLessonId === lesson.id && !activeTaskId}
              isUnsynced={unsyncedIds?.has(lesson.id) ?? false}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => toggleLessonCollapse(lesson.id)}
              editingId={editingId}
              editingValue={editingValue}
              onEditingValueChange={onEditingValueChange}
              onStartEditing={onStartEditing}
              onCommitEditing={onCommitEditing}
              onCancelEditing={onCancelEditing}
              onSelect={() => onSelect(lesson.id)}
              onDelete={() => onDelete(lesson.id)}
              isMenuOpen={openMenuId === lesson.id}
              onToggleMenu={() =>
                setOpenMenuId((prev) =>
                  prev === lesson.id ? null : lesson.id,
                )
              }
              onCloseMenu={() => setOpenMenuId(null)}
              menuBtnRef={(el) => {
                menuBtnRefs.current[lesson.id] = el;
              }}
              menuAnchor={{
                current: menuBtnRefs.current[lesson.id] ?? null,
              }}
            />

            {!isCollapsed && lesson.tasks.map((task) => (
              <TaskItem
                key={task.id}
                stageId={stageId}
                lessonId={lesson.id}
                readOnly={readOnly}
                task={task}
                isActive={
                  activeLessonId === lesson.id && activeTaskId === task.id
                }
                editingId={editingId}
                editingValue={editingValue}
                onEditingValueChange={onEditingValueChange}
                onStartEditing={onStartEditing}
                onCommitEditing={onCommitEditing}
                onCancelEditing={onCancelEditing}
                onSelect={() => onSelectTask(lesson.id, task.id)}
                onDelete={() => onDeleteTask(lesson.id, task.id)}
                isMenuOpen={openMenuId === task.id}
                onToggleMenu={() =>
                  setOpenMenuId((prev) =>
                    prev === task.id ? null : task.id,
                  )
                }
                onCloseMenu={() => setOpenMenuId(null)}
                menuBtnRef={(el) => {
                  menuBtnRefs.current[task.id] = el;
                }}
                menuAnchor={{
                  current: menuBtnRefs.current[task.id] ?? null,
                }}
              />
            ))}

            {!readOnly && !isCollapsed && (
              <button
                type="button"
                className={styles.addTaskBtn}
                onClick={() => onAddTask(lesson.id)}
              >
                + Добавить задание
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// === LessonItem ===

interface LessonItemProps {
  stageId: string;
  readOnly: boolean;
  lesson: ConstructorLesson;
  isActive: boolean;
  isUnsynced: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  editingId: string | null;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onStartEditing: (id: string, currentTitle: string) => void;
  onCommitEditing: (
    stageId: string,
    lessonId?: string,
    taskId?: string,
  ) => void;
  onCancelEditing: () => void;
  onSelect: () => void;
  onDelete: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  menuBtnRef: (el: HTMLButtonElement | null) => void;
  menuAnchor: { current: HTMLElement | null };
}

function LessonItem({
  stageId,
  readOnly,
  lesson,
  isActive,
  isUnsynced,
  isCollapsed,
  onToggleCollapse,
  editingId,
  editingValue,
  onEditingValueChange,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onSelect,
  onDelete,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  menuBtnRef,
  menuAnchor,
}: LessonItemProps) {
  const isEditing = !readOnly && editingId === lesson.id;

  const hasTasks = lesson.tasks.length > 0;

  return (
    <div className={styles.lessonItem}>
      {isEditing ? (
        <InlineEditor
          value={editingValue}
          onChange={onEditingValueChange}
          onCommit={() => onCommitEditing(stageId, lesson.id)}
          onCancel={onCancelEditing}
          className={styles.lessonInlineEditor}
        />
      ) : (
        <button
          type="button"
          className={cn([styles.lessonBtn], {
            [styles.lessonBtnActive]: isActive,
          })}
          onClick={onSelect}
        >
          {lesson.title}
        </button>
      )}

      {!readOnly && isUnsynced && (
        <span title="Не сохранено">
          <UnsyncedIcon className={styles.unsyncedIconSmall} />
        </span>
      )}

      {hasTasks && (
        <button
          type="button"
          className={styles.chevronBtn}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Развернуть урок' : 'Свернуть урок'}
        >
          <ChevronDownSvg
            className={cn([styles.chevronIcon], {
              [styles.chevronIconCollapsed]: isCollapsed,
            })}
          />
        </button>
      )}

      {!readOnly && (
        <div className={styles.moreWrapper}>
          <button
            type="button"
            ref={menuBtnRef}
            className={styles.itemMoreBtn}
            onClick={onToggleMenu}
            aria-label={`Действия с ${lesson.title}`}
          >
            <span className={styles.itemMoreDot} />
            <span className={styles.itemMoreDot} />
            <span className={styles.itemMoreDot} />
          </button>
          <DropdownMenu
            isOpen={isMenuOpen}
            onClose={onCloseMenu}
            anchorRef={menuAnchor}
            className={styles.dropdown}
          >
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                onStartEditing(lesson.id, lesson.title);
                onCloseMenu();
              }}
            >
              Переименовать
            </button>
            <button
              type="button"
              className={cn([styles.dropdownItem, styles.dropdownItemDanger])}
              onClick={() => {
                onDelete();
                onCloseMenu();
              }}
            >
              Удалить
            </button>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// === TaskItem ===

interface TaskItemProps {
  stageId: string;
  lessonId: string;
  readOnly: boolean;
  task: ConstructorTask;
  isActive: boolean;
  editingId: string | null;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onStartEditing: (id: string, currentTitle: string) => void;
  onCommitEditing: (
    stageId: string,
    lessonId?: string,
    taskId?: string,
  ) => void;
  onCancelEditing: () => void;
  onSelect: () => void;
  onDelete: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  menuBtnRef: (el: HTMLButtonElement | null) => void;
  menuAnchor: { current: HTMLElement | null };
}

function TaskItem({
  stageId,
  lessonId,
  readOnly,
  task,
  isActive,
  editingId,
  editingValue,
  onEditingValueChange,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onSelect,
  onDelete,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  menuBtnRef,
  menuAnchor,
}: TaskItemProps) {
  const isEditing = !readOnly && editingId === task.id;

  return (
    <div className={styles.taskItem}>
      {isEditing ? (
        <InlineEditor
          value={editingValue}
          onChange={onEditingValueChange}
          onCommit={() => onCommitEditing(stageId, lessonId, task.id)}
          onCancel={onCancelEditing}
          className={styles.taskInlineEditor}
        />
      ) : (
        <button
          type="button"
          className={cn([styles.taskBtn], {
            [styles.taskBtnActive]: isActive,
          })}
          onClick={onSelect}
        >
          {task.title}
        </button>
      )}

      {!readOnly && (
        <div className={styles.moreWrapper}>
          <button
            type="button"
            ref={menuBtnRef}
            className={styles.itemMoreBtn}
            onClick={onToggleMenu}
            aria-label={`Действия с ${task.title}`}
          >
            <span className={styles.itemMoreDot} />
            <span className={styles.itemMoreDot} />
            <span className={styles.itemMoreDot} />
          </button>
          <DropdownMenu
            isOpen={isMenuOpen}
            onClose={onCloseMenu}
            anchorRef={menuAnchor}
            className={styles.dropdown}
          >
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                onStartEditing(task.id, task.title);
                onCloseMenu();
              }}
            >
              Переименовать
            </button>
            <button
              type="button"
              className={cn([styles.dropdownItem, styles.dropdownItemDanger])}
              onClick={() => {
                onDelete();
                onCloseMenu();
              }}
            >
              Удалить
            </button>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
