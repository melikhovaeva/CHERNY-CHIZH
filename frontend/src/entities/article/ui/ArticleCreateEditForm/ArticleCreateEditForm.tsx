import { Form } from '@/shared';
import type { InfoTagRead } from '@/shared/api/generated/articles.generated';
import {
  Button,
  ImageUpload,
  Input,
  TagInput,
  TextArea,
} from '@/shared/ui/components';
import { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ArticleAdminRead } from '../../api/articleAdmin.api';
import styles from './ArticleCreateEditForm.module.scss';

export interface ArticleFormData {
  title: string;
  description: string;
  tags: InfoTagRead[];
  imagePreview?: string | null;
  imageFile?: File;
}

interface ArticleCreateEditFormProps {
  data?: ArticleAdminRead;
  onSubmit?: (values: ArticleFormData) => void | Promise<void>;
}

export function ArticleCreateEditForm({
  data,
  onSubmit,
}: ArticleCreateEditFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: data?.title ?? '',
      description: data?.description ?? '',
      tags: data?.tags ?? [],
      imagePreview: data?.imagePreview ?? null,
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data?.imagePreview ?? null,
  );
  const objectUrlRef = useRef<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const handleImageChange = useCallback(
    (file: File | null) => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      imageFileRef.current = file;
      if (file) {
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setPreviewUrl(url);
        setValue('imagePreview', url);
      } else {
        setPreviewUrl(null);
        setValue('imagePreview', null);
      }
    },
    [setValue],
  );

  const onFormSubmit = (values: ArticleFormData) => {
    onSubmit?.({ ...values, imageFile: imageFileRef.current ?? undefined });
  };

  return (
    <Form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <h4 className={styles.infoTitle}>Информация</h4>
        <Input
          label="Название статьи"
          placeholder="Введите название"
          maxLength={255}
          error={errors.title?.message}
          required
          {...register('title', {
            required: 'Обязательное поле',
            maxLength: { value: 255, message: 'Максимум 255 символов' },
          })}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            maxLength: { value: 400, message: 'Максимум 400 символов' },
          }}
          render={({ field, fieldState }) => (
            <TextArea
              ref={field.ref}
              label="Описание статьи"
              placeholder="Введите описание"
              maxLength={400}
              error={fieldState.error?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Controller
          control={control}
          name="tags"
          render={({ field, fieldState }) => (
            <TagInput
              label="Теги"
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
      </div>
      <ImageUpload value={previewUrl} onChange={handleImageChange} />

      <Button type="submit">Сохранить</Button>
    </Form>
  );
}
