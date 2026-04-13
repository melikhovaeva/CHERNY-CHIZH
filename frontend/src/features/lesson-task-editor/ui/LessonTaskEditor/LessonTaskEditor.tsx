import { DropdownMenu } from '@/shared/ui/components/DropdownMenu';
import { useRef, useState } from 'react';
import { useLessonTaskEditor } from '../../model/useLessonTaskEditor';
import type { TaskEditorSavePayload, TaskEditorState } from '../../model/types';
import SaveSvg from '../../assets/save.svg?react';
import styles from './LessonTaskEditor.module.scss';

const LABELS = {
  taskTitlePlaceholder: 'Название задания',
  questionLabel: (n: number) => `Вопрос ${n}`,
  questionPlaceholder: 'Введите содержание вопроса',
  answersSection: 'Ответы',
  answerPlaceholder: 'Ответ',
  addAnswer: '+ Добавить вариант ответа',
  addQuestion: '+ Добавить вопрос',
  publish: 'Опубликовать',
  unpublish: 'Снять с публикации',
  deleteTask: 'Удалить задание',
  duplicate: 'Дублировать',
  unsavedHint: 'Есть несохранённые изменения',
  savedHint: 'Задание сохранено',
  save: 'Сохранить',
} as const;

function GearIcon() {
  return (
    <svg width={18} height={18} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden>
      <path
        fill='currentColor'
        d='M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6 3.6z'
      />
    </svg>
  );
}

function SyncIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path d='M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z' />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width={16} height={16} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
    </svg>
  );
}

export interface LessonTaskEditorProps {
  taskTitle: string;
  initialState?: TaskEditorState;
  isSynced?: boolean;
  isPublished?: boolean;
  onSave: (payload: TaskEditorSavePayload) => Promise<number>;
  onTitleChange: (title: string) => void;
  onPublishToggle?: (publish: boolean) => Promise<void>;
  onDeleteTask?: () => void;
}

export function LessonTaskEditor({
  taskTitle,
  initialState,
  isSynced = false,
  isPublished = false,
  onSave,
  onTitleChange,
  onPublishToggle,
  onDeleteTask,
}: LessonTaskEditorProps) {
  const [gearOpen, setGearOpen] = useState(false);
  const gearBtnRef = useRef<HTMLButtonElement>(null);

  const {
    title,
    questions,
    isSaving,
    isDirty,
    handleTitleChange,
    addQuestion,
    updateQuestionText,
    addAnswer,
    updateAnswerText,
    toggleAnswerCorrect,
    removeAnswer,
    handleSave,
  } = useLessonTaskEditor({
    taskTitle,
    initialState,
    onSave,
    onTitleChange,
  });

  const showUnsynced = !isSynced || isDirty;

  return (
    <div className={styles.root}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.pencilWrap}>
            <svg className={styles.pencilIcon} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
              <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
            </svg>
          </div>
          <input
            className={styles.titleInput}
            type='text'
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={LABELS.taskTitlePlaceholder}
            aria-label='Название задания'
          />
        </div>
        <div className={styles.headerRight}>
          <span
            className={`${styles.syncWrap}${showUnsynced ? ` ${styles.syncWrap_dirty}` : ''}`}
            title={showUnsynced ? LABELS.unsavedHint : LABELS.savedHint}
          >
            <SyncIcon className={styles.syncIcon} />
          </span>
          <div className={styles.gearWrap}>
            <button
              type='button'
              ref={gearBtnRef}
              className={styles.gearBtn}
              aria-label='Дополнительные действия'
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
              <button type='button' className={styles.dropdownItem} disabled>
                {LABELS.duplicate}
              </button>
              {onDeleteTask && (
                <button
                  type='button'
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={() => {
                    setGearOpen(false);
                    onDeleteTask();
                  }}
                >
                  {LABELS.deleteTask}
                </button>
              )}
            </DropdownMenu>
          </div>
          <button
            type='button'
            className={styles.saveIconBtn}
            onClick={() => void handleSave()}
            disabled={isSaving || !isDirty}
            aria-label={LABELS.save}
            title={LABELS.save}
          >
            <SaveSvg className={styles.saveIcon} aria-hidden />
          </button>
          {onPublishToggle && (
            <button
              type='button'
              className={styles.publishBtn}
              onClick={() => void onPublishToggle(!isPublished)}
              disabled={isSaving}
            >
              {isPublished ? LABELS.unpublish : LABELS.publish}
            </button>
          )}
        </div>
      </header>

      {/* Тело редактора */}
      <div className={styles.body}>
        {questions.map((question, qi) => (
          <div key={question.id} className={styles.questionCard}>
            <span className={styles.questionLabel}>
              {LABELS.questionLabel(qi + 1)}
            </span>
            <textarea
              className={styles.questionTextarea}
              value={question.text}
              onChange={(e) => updateQuestionText(question.id, e.target.value)}
              placeholder={LABELS.questionPlaceholder}
              aria-label={LABELS.questionLabel(qi + 1)}
            />

            <div className={styles.answersSection}>
              <span className={styles.answersLabel}>{LABELS.answersSection}</span>

              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`${styles.answerRow}${answer.isCorrect ? ` ${styles.answerRow_correct}` : ''}`}
                >
                  <input
                    className={styles.answerInput}
                    type='text'
                    value={answer.text}
                    onChange={(e) =>
                      updateAnswerText(question.id, answer.id, e.target.value)
                    }
                    placeholder={LABELS.answerPlaceholder}
                    aria-label={LABELS.answerPlaceholder}
                  />
                  <button
                    type='button'
                    className={styles.answerCorrectBtn}
                    onClick={() => toggleAnswerCorrect(question.id, answer.id)}
                    title={answer.isCorrect ? 'Убрать правильный ответ' : 'Отметить как правильный'}
                    aria-pressed={answer.isCorrect}
                  >
                    <CheckIcon />
                  </button>
                  <button
                    type='button'
                    className={styles.answerDeleteBtn}
                    onClick={() => removeAnswer(question.id, answer.id)}
                    aria-label='Удалить вариант ответа'
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}

              <button
                type='button'
                className={styles.addAnswerBtn}
                onClick={() => addAnswer(question.id)}
              >
                {LABELS.addAnswer}
              </button>
            </div>
          </div>
        ))}

        <button
          type='button'
          className={styles.addQuestionBtn}
          onClick={addQuestion}
        >
          {LABELS.addQuestion}
        </button>
      </div>
    </div>
  );
}
