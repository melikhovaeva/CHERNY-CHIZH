import { Form } from '@/shared';
import type {
  Course,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';
import {
  Button,
  Input,
  Select,
  TagInput,
  TextArea,
} from '@/shared/ui/components';
import { Controller, useForm } from 'react-hook-form';
import styles from './CourseCreateEditForm.module.scss';
import {
  difficultyOptions,
  formFields,
  type CourseCreateEditFormProps,
} from './model';

type CourseFormValues = Course & {
  tags: InfoTagRead[];
};

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

  const onFormSubmit = (values: CourseFormValues) => {
    onSubmit?.(values);
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <h4 className={styles.infoTitle}>Информация</h4>
      <Input
        label={formFields.title.label}
        placeholder={formFields.title.placeholder}
        maxLength={formFields.title.validation.maxLength?.value}
        error={errors.title?.message}
        required={!!formFields.title.validation?.required}
        {...register(formFields.title.name, formFields.title.validation)}
      />

      <Controller
        control={control}
        name={formFields.description.name}
        rules={formFields.description.validation}
        render={({ field, fieldState }) => (
          <TextArea
            ref={field.ref}
            label={formFields.description.label}
            placeholder={formFields.description.placeholder}
            maxLength={formFields.description.validation.maxLength?.value}
            error={fieldState.error?.message}
            required={!!formFields.description.validation?.required}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />

      <Input
        label={formFields.actionText.label}
        placeholder={formFields.actionText.placeholder}
        maxLength={formFields.actionText.validation.maxLength?.value}
        error={errors.actionText?.message}
        required={!!formFields.actionText.validation?.required}
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
            required={!!formFields.difficulty.validation?.required}
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
    </Form>
  );
};
