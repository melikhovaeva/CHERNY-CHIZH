import { generateLocalId } from '@/entities/course';

export interface TaskAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface TaskQuestion {
  id: string;
  text: string;
  order: number;
  answers: TaskAnswer[];
}

export interface TaskEditorState {
  questions: TaskQuestion[];
}

export function createEmptyAnswer(order: number): TaskAnswer {
  return { id: generateLocalId(), text: '', isCorrect: false, order };
}

export function createEmptyQuestion(order: number): TaskQuestion {
  return {
    id: generateLocalId(),
    text: '',
    order,
    answers: [createEmptyAnswer(0)],
  };
}

export type TaskEditorSavePayload = {
  title: string;
  questions: Array<{
    text: string;
    order: number;
    answers: Array<{ text: string; isCorrect: boolean; order: number }>;
  }>;
};
