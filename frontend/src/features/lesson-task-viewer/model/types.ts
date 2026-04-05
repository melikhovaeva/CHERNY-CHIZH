import type { CourseTaskQuestionRead } from '@/shared/api/generated/education.generated';
import type { UserTaskAttemptReadRead } from '@/entities/course';

export type { CourseTaskQuestionRead };

/**
 * Состояние одного вопроса во вьювере:
 * null  — ещё не отвечено в рамках текущей сессии
 * number — id выбранного варианта (либо уже сохранённого, либо только что выбранного)
 */
export interface QuestionViewState {
  questionId: number;
  selectedAnswerId: number | null;
  /**
   * true — ответ отправлен на сервер (результат известен)
   * false — ещё не отправлен
   */
  submitted: boolean;
  isCorrect: boolean | null;
}

export function buildInitialViewState(
  questions: CourseTaskQuestionRead[],
  savedAttempts: UserTaskAttemptReadRead[],
): QuestionViewState[] {
  const attemptMap = new Map(savedAttempts.map((a) => [a.questionId, a]));
  return questions.map((q) => {
    const saved = attemptMap.get(q.id);
    if (saved) {
      return {
        questionId: q.id,
        selectedAnswerId: saved.selectedAnswerId,
        submitted: true,
        isCorrect: saved.isCorrect,
      };
    }
    return {
      questionId: q.id,
      selectedAnswerId: null,
      submitted: false,
      isCorrect: null,
    };
  });
}
