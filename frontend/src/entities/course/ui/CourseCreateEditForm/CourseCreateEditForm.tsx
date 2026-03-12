import { Form } from '@/shared';
import type { Course } from '@/shared/api/generated/courses.generated';
import { Button, Input } from '@/shared/ui/components';
import { useForm } from 'react-hook-form';
import { formFields, type CourseCreateEditFormProps } from './model';

export const CourseCreateEditForm = ({
  data,
  onSubmit,
}: CourseCreateEditFormProps) => {
  const {
    register,
    handleSubmit,
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
        maxLength={formFields.title.validation.maxLength?.value}
        error={errors.title?.message}
        {...register(formFields.title.name, formFields.title.validation)}
      />

      <Input
        label={formFields.description.label}
        multiline
        maxLength={formFields.description.validation.maxLength?.value}
        error={errors.description?.message}
        {...register(
          formFields.description.name,
          formFields.description.validation,
        )}
      />

      <Input
        label={formFields.actionText.label}
        maxLength={formFields.actionText.validation.maxLength?.value}
        error={errors.actionText?.message}
        {...register(
          formFields.actionText.name,
          formFields.actionText.validation,
        )}
      />

      {/* TODO: Уровень сложности (difficulty) */}
      {/* TODO: Загрузка изображения (imagePreview) */}
      {/* TODO: Теги (tags) */}

      <Button type="submit">Сохранить</Button>
    </Form>
  );
};
