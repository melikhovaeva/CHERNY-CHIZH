import type {
  Course,
  DifficultyEnum,
} from '@/shared/api/generated/courses.generated';
import type { RegisterOptions } from 'react-hook-form';

type CourseFieldRegisterOptions = RegisterOptions<Course>;

export enum CourseCreateEditFormFieldsEnum {
  TITLE = 'title',
  DESCRIPTION = 'description',
  ACTION_TEXT = 'actionText',
  DIFFICULTY = 'difficulty',
  IMAGE_PREVIEW = 'imagePreview',
  TAGS = 'tags',
}

export const formFields = {
  [CourseCreateEditFormFieldsEnum.TITLE]: {
    label: 'Название курса',
    name: CourseCreateEditFormFieldsEnum.TITLE,
    validation: {
      required: 'Обязательное поле',
      maxLength: {
        value: 100,
        message: 'Максимум 100 символов',
      },
    } satisfies CourseFieldRegisterOptions,
  },
  [CourseCreateEditFormFieldsEnum.DESCRIPTION]: {
    label: 'Описание курса',
    name: CourseCreateEditFormFieldsEnum.DESCRIPTION,
    validation: {
      required: 'Обязательное поле',
      maxLength: {
        value: 400,
        message: 'Максимум 400 символов',
      },
    } satisfies CourseFieldRegisterOptions,
  },
  [CourseCreateEditFormFieldsEnum.ACTION_TEXT]: {
    label: 'Текст на кнопке',
    name: CourseCreateEditFormFieldsEnum.ACTION_TEXT,
    validation: {
      required: 'Обязательное поле',
      maxLength: {
        value: 26,
        message: 'Максимум 26 символов',
      },
    } satisfies CourseFieldRegisterOptions,
  },
  // Поля ниже пока не имеют UI-реализации, зарезервированы для будущих задач
  [CourseCreateEditFormFieldsEnum.DIFFICULTY]: {
    label: 'Уровень',
    name: CourseCreateEditFormFieldsEnum.DIFFICULTY,
  },
  [CourseCreateEditFormFieldsEnum.IMAGE_PREVIEW]: {
    label: 'Изображение',
    name: CourseCreateEditFormFieldsEnum.IMAGE_PREVIEW,
  },
  [CourseCreateEditFormFieldsEnum.TAGS]: {
    label: 'Теги',
    name: CourseCreateEditFormFieldsEnum.TAGS,
  },
} as const;

export const difficultyOptions: { value: DifficultyEnum; label: string }[] = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
];
