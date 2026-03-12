import { Form } from '@/shared';
import type { Course } from '@/shared/api/generated/courses.generated';
import { Button, Input, Select } from '@/shared/ui/components';
import { Controller, useForm } from 'react-hook-form';
import {
  difficultyOptions,
  formFields,
  type CourseCreateEditFormProps,
} from './model';

export const CourseCreateEditForm = ({
  data,
  onSubmit,
}: CourseCreateEditFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Course>({
    defaultValues: data,
  });

  const onFormSubmit = (values: Course) => {
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
      {/* TODO: Теги (tags) */}
      <Button type="submit">Сохранить</Button>
    </Form>
  );
};
