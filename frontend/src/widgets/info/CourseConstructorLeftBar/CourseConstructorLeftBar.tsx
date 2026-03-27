import type {
  ConstructorLesson,
  ConstructorStage,
  ConstructorTask,
} from '@/entities/course';
import { cn } from '@/shared/lib/utils';
import { LeftBar } from '@/shared/ui';
import { DropdownMenu } from '@/shared/ui/components';
import ChevronDownSvg from '@/shared/ui/components/Select/assets/chevron-down.svg?react';
import { useRef, useState } from 'react';
import styles from './CourseConstructorLeftBar.module.scss';

export interface CourseConstructorLeftBarProps {
  backUrl: string;
  title: string;
  stages: ConstructorStage[];
  activeStageId: string | null;
  activeLessonId: string | null;
  activeTaskId: string | null;
  onSelectStage: (stageId: string) => void;
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
  backUrl,
  title,
  stages,
  activeStageId,
  activeLessonId,
  activeTaskId,
  onSelectStage,
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
  const [openAddMenuId, setOpenAddMenuId] = useState<string | null>(null);
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [collapsedStageIds, setCollapsedStageIds] = useState<Set<string>>(
    new Set(),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const addBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
    <LeftBar backUrl={backUrl} title={title}>
      <div className={styles.stageList}>
        {stages.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isLast={index === stages.length - 1}
            isActive={activeStageId === stage.id && !activeLessonId}
            isCollapsed={collapsedStageIds.has(stage.id)}
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
            onSelect={() => onSelectStage(stage.id)}
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
            addBtnRef={(el) => {
              addBtnRefs.current[stage.id] = el;
            }}
            moreBtnRef={(el) => {
              moreBtnRefs.current[stage.id] = el;
            }}
            isAddMenuOpen={openAddMenuId === stage.id}
            onToggleAddMenu={() =>
              setOpenAddMenuId((prev) =>
                prev === stage.id ? null : stage.id,
              )
            }
            onCloseAddMenu={() => setOpenAddMenuId(null)}
            addMenuAnchor={{
              current: addBtnRefs.current[stage.id] ?? null,
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
              setOpenAddMenuId(null);
            }}
            onAddStage={() => {
              onAddStage();
              setOpenAddMenuId(null);
            }}
            onDeleteStage={() => {
              onDeleteStage(stage.id);
              setOpenMoreMenuId(null);
            }}
          />
        ))}
      </div>
    </LeftBar>
  );
};

// === StageCard ===

interface StageCardProps {
  stage: ConstructorStage;
  isLast: boolean;
  isActive: boolean;
  isCollapsed: boolean;
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
  onSelect: () => void;
  onToggleCollapse: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectTask: (lessonId: string, taskId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddTask: (lessonId: string) => void;
  onDeleteTask: (lessonId: string, taskId: string) => void;
  addBtnRef: (el: HTMLButtonElement | null) => void;
  moreBtnRef: (el: HTMLButtonElement | null) => void;
  isAddMenuOpen: boolean;
  onToggleAddMenu: () => void;
  onCloseAddMenu: () => void;
  addMenuAnchor: { current: HTMLElement | null };
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
  isLast,
  isActive,
  isCollapsed,
  activeLessonId,
  activeTaskId,
  editingId,
  editingValue,
  onEditingValueChange,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onSelect,
  onToggleCollapse,
  onSelectLesson,
  onSelectTask,
  onDeleteLesson,
  onAddTask,
  onDeleteTask,
  addBtnRef,
  moreBtnRef,
  isAddMenuOpen,
  onToggleAddMenu,
  onCloseAddMenu,
  addMenuAnchor,
  isMoreMenuOpen,
  onToggleMoreMenu,
  onCloseMoreMenu,
  moreMenuAnchor,
  onAddLesson,
  onAddStage,
  onDeleteStage,
}: StageCardProps) {
  const isEditingStage = editingId === stage.id;

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
            <button
              type="button"
              className={cn([styles.stageHeaderBtn], {
                [styles.stageHeaderBtnActive]: isActive,
              })}
              onClick={onSelect}
            >
              <span className={styles.stageLabel}>{stage.label}</span>
              <span className={styles.stageTitle}>{stage.title}</span>
            </button>
          )}

          <div className={styles.headerActions}>
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
                  onClick={() => onStartEditing(stage.id, stage.title)}
                >
                  Переименовать
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
          </div>
        </div>

        {!isCollapsed && stage.lessons.length > 0 && (
          <LessonsList
            stageId={stage.id}
            lessons={stage.lessons}
            activeLessonId={activeLessonId}
            activeTaskId={activeTaskId}
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

      {isLast && (
        <div className={styles.separator}>
          <div className={styles.separatorLine} />
          <button
            type="button"
            ref={addBtnRef}
            className={styles.addBtn}
            onClick={onToggleAddMenu}
            aria-label="Добавить"
          >
            <span className={styles.addBtnIcon}>+</span>
          </button>
        </div>
      )}

      {isLast && (
        <DropdownMenu
          isOpen={isAddMenuOpen}
          onClose={onCloseAddMenu}
          anchorRef={addMenuAnchor}
          className={styles.addDropdown}
        >
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={onAddLesson}
          >
            Добавить урок
          </button>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={onAddStage}
          >
            Добавить ступень
          </button>
        </DropdownMenu>
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
  lessons: ConstructorLesson[];
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
  onSelect: (lessonId: string) => void;
  onSelectTask: (lessonId: string, taskId: string) => void;
  onDelete: (lessonId: string) => void;
  onAddTask: (lessonId: string) => void;
  onDeleteTask: (lessonId: string, taskId: string) => void;
}

function LessonsList({
  stageId,
  lessons,
  activeLessonId,
  activeTaskId,
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
  const menuBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  return (
    <div className={styles.lessonList}>
      {lessons.map((lesson) => (
        <div key={lesson.id} className={styles.lessonGroup}>
          <LessonItem
            stageId={stageId}
            lesson={lesson}
            isActive={activeLessonId === lesson.id && !activeTaskId}
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

          {lesson.tasks.map((task) => (
            <TaskItem
              key={task.id}
              stageId={stageId}
              lessonId={lesson.id}
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

          <button
            type="button"
            className={styles.addTaskBtn}
            onClick={() => onAddTask(lesson.id)}
          >
            + Добавить задание
          </button>
        </div>
      ))}
    </div>
  );
}

// === LessonItem ===

interface LessonItemProps {
  stageId: string;
  lesson: ConstructorLesson;
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

function LessonItem({
  stageId,
  lesson,
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
}: LessonItemProps) {
  const isEditing = editingId === lesson.id;

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
    </div>
  );
}

// === TaskItem ===

interface TaskItemProps {
  stageId: string;
  lessonId: string;
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
  const isEditing = editingId === task.id;

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
    </div>
  );
}
