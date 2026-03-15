import { Form } from '@/shared';
import type {
  Course,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';
import { AbstractField } from '@/shared/ui/components/AbstractField/AbstractField';
import { Button, Input, Select, TagInput } from '@/shared/ui/components';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  difficultyOptions,
  formFields,
  type CourseCreateEditFormProps,
} from './model';

type CourseFormValues = Course & {
  tags: InfoTagRead[];
};

const DEMO_SELECT_OPTIONS = [
  { value: 'option1', label: 'Первый вариант' },
  { value: 'option2', label: 'Второй вариант' },
  { value: 'option3', label: 'Третий вариант' },
  { value: 'option4', label: 'Четвёртый вариант' },
];

export const CourseCreateEditForm = ({
  data,
  onSubmit,
}: CourseCreateEditFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseFormValues>({
    defaultValues: data,
  });

  const [demoInput, setDemoInput] = useState('');
  const [demoTextArea, setDemoTextArea] = useState('');
  const [demoSelect, setDemoSelect] = useState('');
  const [demoInputSelect, setDemoInputSelect] = useState('');

  const onFormSubmit = (values: CourseFormValues) => {
    onSubmit?.(values);
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <Input
        label={formFields.title.label}
        placeholder={formFields.title.placeholder}
        maxLength={formFields.title.validation.maxLength?.value}
        error={errors.title?.message}
        {...register(formFields.title.name, formFields.title.validation)}
      />

      <Input
        label={formFields.description.label}
        multiline
        placeholder={formFields.description.placeholder}
        maxLength={formFields.description.validation.maxLength?.value}
        error={errors.description?.message}
        {...register(
          formFields.description.name,
          formFields.description.validation,
        )}
      />

      <Input
        label={formFields.actionText.label}
        placeholder={formFields.actionText.placeholder}
        maxLength={formFields.actionText.validation.maxLength?.value}
        error={errors.actionText?.message}
        {...register(
          formFields.actionText.name,
          formFields.actionText.validation,
        )}
      />

      <Controller
        control={control}
        name={formFields.difficulty.name}
        rules={formFields.difficulty.validation}
        render={({ field, fieldState }) => (
          <Select
            label={formFields.difficulty.label}
            options={difficultyOptions}
            value={field.value ?? ''}
            placeholder={formFields.difficulty.placeholder}
            error={fieldState.error?.message}
            onChange={(value) => field.onChange(value as Course['difficulty'])}
            variant="input"
          />
        )}
      />

      {/* TODO: Загрузка изображения (imagePreview) */}

      <Controller
        control={control}
        name={formFields.tags.name}
        render={({ field, fieldState }) => (
          <TagInput
            label={formFields.tags.label}
            value={{
              existing: field.value ?? [],
              created: [],
            }}
            onChange={(next) => {
              field.onChange(next.existing);
            }}
            placeholder="Введите теги"
            error={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit">Сохранить</Button>

      {/* ──── Тест AbstractField (все варианты) ──── */}

      <AbstractField
        variant="input"
        label="Тест Input"
        placeholder="Введите текст..."
        value={demoInput}
        onChange={setDemoInput}
        required
        helperText="Вспомогательный текст для input"
        error={demoInput.length > 20 ? 'Максимум 20 символов' : undefined}
      />

      <AbstractField
        variant="text-area"
        label="Тест TextArea"
        placeholder="Введите развёрнутый текст..."
        value={demoTextArea}
        onChange={setDemoTextArea}
        rows={4}
        error={
          demoTextArea.length > 100 ? 'Максимум 100 символов' : undefined
        }
      />

      <AbstractField
        variant="select"
        label="Тест Select"
        placeholder="Выберите вариант"
        options={DEMO_SELECT_OPTIONS}
        value={demoSelect}
        onChange={setDemoSelect}
        required
      />

      <AbstractField
        variant="input-select"
        label="Тест InputSelect"
        placeholder="Введите или выберите..."
        options={DEMO_SELECT_OPTIONS}
        value={demoInputSelect}
        onChange={setDemoInputSelect}
      />
    </Form>
  );
};
