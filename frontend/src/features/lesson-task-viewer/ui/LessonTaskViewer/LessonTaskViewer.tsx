import { useEffect, useState, useCallback } from 'react';
import {
  useGetTaskAttemptsQuery,
  useSubmitTaskAttemptMutation,
  useResetTaskAttemptsMutation,
} from '@/entities/course';
import type { CourseTaskQuestionRead } from '@/shared/api/generated/education.generated';
import { buildInitialViewState, type QuestionViewState } from '../../model/types';
import styles from './LessonTaskViewer.module.scss';
import { cn } from '@/shared/lib/utils';

const LABELS = {
  resetBtn: 'Сбросить прогресс',
  emptyHint: 'В этом задании пока нет вопросов.',
  questionLabel: (n: number) => `Вопрос ${n}`,
} as const;

function TaskIcon() {
  return (
    <svg width={20} height={20} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM10 17H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z' />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={18} height={18} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width={18} height={18} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width={16} height={16} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z' />
    </svg>
  );
}

export interface LessonTaskViewerProps {
  taskTitle: string;
  taskServerId: number;
  questions: CourseTaskQuestionRead[];
  isAdmin?: boolean;
}

export function LessonTaskViewer({
  taskTitle,
  taskServerId,
  questions,
  isAdmin = false,
}: LessonTaskViewerProps) {
  const {
    data: savedAttempts,
    isLoading: isAttemptsLoading,
    isFetching: isAttemptsFetching,
  } = useGetTaskAttemptsQuery(
    { task: taskServerId },
    { skip: !taskServerId },
  );

  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitTaskAttemptMutation();
  const [resetAttempts, { isLoading: isResetting }] = useResetTaskAttemptsMutation();

  const [viewState, setViewState] = useState<QuestionViewState[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    // Ждём завершения запроса — savedAttempts без дефолта undefined пока идёт загрузка
    if (isAttemptsLoading || isAttemptsFetching) return;
    setViewState(buildInitialViewState(questions, savedAttempts ?? []));
    setInitialized(true);
  }, [questions, savedAttempts, initialized, isAttemptsLoading, isAttemptsFetching]);

  // Сброс при смене задания
  useEffect(() => {
    setInitialized(false);
  }, [taskServerId]);

  const handleSelectAnswer = useCallback(
    async (questionId: number, answerId: number) => {
      const alreadySubmitted = viewState.find(
        (s) => s.questionId === questionId,
      )?.submitted;
      if (alreadySubmitted || isSubmitting) return;

      try {
        const result = await submitAttempt({
          userTaskAttemptCreate: { questionId, answerId },
        }).unwrap();

        setViewState((prev) =>
          prev.map((s) =>
            s.questionId === questionId
              ? {
                  ...s,
                  selectedAnswerId: answerId,
                  submitted: true,
                  isCorrect: result.isCorrect ?? false,
                }
              : s,
          ),
        );
      } catch {
        // Silently ignore — backend may reject if already answered
      }
    },
    [viewState, isSubmitting, submitAttempt],
  );

  const handleReset = useCallback(async () => {
    if (!isAdmin || isResetting) return;
    try {
      await resetAttempts({ task: taskServerId }).unwrap();
      setViewState(buildInitialViewState(questions, []));
    } catch {
      // ignore
    }
  }, [isAdmin, isResetting, resetAttempts, taskServerId, questions]);

  if (questions.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.taskIcon}>
              <TaskIcon />
            </span>
            <span className={styles.taskTitle}>{taskTitle}</span>
          </div>
        </div>
        <div className={styles.body}>
          <p className={styles.emptyHint}>{LABELS.emptyHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.taskIcon}>
            <TaskIcon />
          </span>
          <span className={styles.taskTitle}>{taskTitle}</span>
        </div>

        {isAdmin && (
          <div className={styles.headerRight}>
            <button
              type='button'
              className={styles.resetBtn}
              onClick={() => void handleReset()}
              disabled={isResetting}
              title={LABELS.resetBtn}
            >
              <ResetIcon />
              {LABELS.resetBtn}
            </button>
          </div>
        )}
      </div>

      <div className={styles.body}>
        {questions.map((question, qIdx) => {
          const state = viewState.find((s) => s.questionId === question.id);
          const isSubmitted = state?.submitted ?? false;

          return (
            <div key={question.id} className={styles.questionCard}>
              <span className={styles.questionLabel}>
                {LABELS.questionLabel(qIdx + 1)}
              </span>
              <p className={styles.questionText}>{question.text}</p>

              <ul className={styles.answersList} role='list'>
                {question.answers.map((answer) => {
                  const isSelected = state?.selectedAnswerId === answer.id;
                  const isCorrect = answer.isCorrect;

                  let modifier: 'correct' | 'wrong' | 'neutral' | null = null;
                  if (isSubmitted) {
                    if (isCorrect) {
                      modifier = 'correct';
                    } else if (isSelected && !isCorrect) {
                      modifier = 'wrong';
                    } else {
                      modifier = 'neutral';
                    }
                  }

                  return (
                    <li key={answer.id}>
                      <button
                        type='button'
                        className={cn([
                          styles.answerBtn,
                          modifier === 'correct' ? styles.answerBtn_correct : '',
                          modifier === 'wrong' ? styles.answerBtn_wrong : '',
                          modifier === 'neutral' ? styles.answerBtn_neutral : '',
                        ])}
                        onClick={() => void handleSelectAnswer(question.id, answer.id)}
                        disabled={isSubmitted || isSubmitting}
                        aria-pressed={isSelected}
                      >
                        <span className={styles.answerStatusIcon} aria-hidden>
                          {isSubmitted && modifier === 'correct' ? (
                            <CheckIcon />
                          ) : isSubmitted && modifier === 'wrong' ? (
                            <CrossIcon />
                          ) : (
                            <span className={styles.answerRadio} />
                          )}
                        </span>
                        <span className={styles.answerText}>{answer.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
