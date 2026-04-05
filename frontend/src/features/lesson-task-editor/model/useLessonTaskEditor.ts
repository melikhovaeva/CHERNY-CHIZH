import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createEmptyAnswer,
  createEmptyQuestion,
  type TaskAnswer,
  type TaskEditorSavePayload,
  type TaskEditorState,
  type TaskQuestion,
} from './types';

export interface UseLessonTaskEditorOptions {
  taskTitle: string;
  initialState?: TaskEditorState;
  /**
   * Called when the user clicks "Опубликовать".
   * Returns the server ID of the saved task.
   */
  onSave: (payload: TaskEditorSavePayload) => Promise<number>;
  onTitleChange: (title: string) => void;
}

export function useLessonTaskEditor({
  taskTitle,
  initialState,
  onSave,
  onTitleChange,
}: UseLessonTaskEditorOptions) {
  const [questions, setQuestions] = useState<TaskQuestion[]>(
    initialState?.questions ?? [],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [title, setTitle] = useState(taskTitle);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    setIsDirty(true);
  }, [questions]);

  useEffect(() => {
    setTitle(taskTitle);
  }, [taskTitle]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      onTitleChange(newTitle);
    },
    [onTitleChange],
  );

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length)]);
  }, []);

  const updateQuestionText = useCallback((questionId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, text } : q)),
    );
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== questionId)
        .map((q, i) => ({ ...q, order: i })),
    );
  }, []);

  const addAnswer = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answers: [...q.answers, createEmptyAnswer(q.answers.length)],
        };
      }),
    );
  }, []);

  const updateAnswerText = useCallback(
    (questionId: string, answerId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, text } : a,
            ),
          };
        }),
      );
    },
    [],
  );

  const toggleAnswerCorrect = useCallback(
    (questionId: string, answerId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId
                ? { ...a, isCorrect: !a.isCorrect }
                : { ...a, isCorrect: false },
            ),
          };
        }),
      );
    },
    [],
  );

  const removeAnswer = useCallback(
    (questionId: string, answerId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            answers: q.answers
              .filter((a: TaskAnswer) => a.id !== answerId)
              .map((a: TaskAnswer, i: number) => ({ ...a, order: i })),
          };
        }),
      );
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave({
        title,
        questions: questions.map((q, qi) => ({
          text: q.text,
          order: qi,
          answers: q.answers.map((a, ai) => ({
            text: a.text,
            isCorrect: a.isCorrect,
            order: ai,
          })),
        })),
      });
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave, title, questions]);

  return {
    title,
    questions,
    isSaving,
    isDirty,
    handleTitleChange,
    addQuestion,
    updateQuestionText,
    removeQuestion,
    addAnswer,
    updateAnswerText,
    toggleAnswerCorrect,
    removeAnswer,
    handleSave,
  };
}
