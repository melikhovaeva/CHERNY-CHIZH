import { useGetBreedsQuery } from '@/entities/breed';
import {
  useNurseryPublishMutation,
  useNurserySetMainPhotoMutation,
  useNurseryUnpublishMutation,
  useNurseryUploadDocumentMutation,
  useNurseryUploadPhotoMutation,
  useV1NurseryDogsCreateMutation,
  useV1NurseryDogsDestroyMutation,
  useV1NurseryDogsDocumentsDestroyMutation,
  useV1NurseryDogsListQuery,
  useV1NurseryDogsPhotosDestroyMutation,
  useV1NurseryDogsRetrieveQuery,
  useV1NurseryDogsUpdateMutation,
} from '@/entities/nursery-dog';
import type {
  DogDocumentsRead,
  DogListRead,
  DogPhotosRead,
} from '@/shared/api/generated/nursery.generated';
import Delete from '@/shared/ui/assets/trash.svg?react';
import {
  Button,
  DatePicker,
  Input,
  Select,
  TextArea,
} from '@/shared/ui/components';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './DogCreateEditPage.module.scss';

const NURSERY_LIST_PATH = '/cabinet/nursery' as const;

const SEX_OPTIONS = [
  { value: 'male', label: 'Мальчик' },
  { value: 'female', label: 'Девочка' },
];

const POTENTIAL_OPTIONS = [
  { value: 'pet', label: 'Домашний питомец' },
  { value: 'show', label: 'Шоу' },
  { value: 'breeding', label: 'Разведение' },
];

const AGE_GROUP_OPTIONS = [
  { value: 'puppy', label: 'Щенок' },
  { value: 'adult', label: 'Собака' },
];

const STATUS_OPTIONS = [
  { value: 'on_sale', label: 'В продаже' },
  { value: 'booked', label: 'Забронирована' },
  { value: 'sold', label: 'Куплена' },
];

interface DogFormState {
  name: string;
  internationalName: string;
  breed: string;
  sex: string;
  birthDate: string;
  color: string;
  potential: string;
  ageGroup: string;
  description: string;
  status: string;
  motherId: string;
  fatherId: string;
}

const INITIAL_FORM: DogFormState = {
  name: '',
  internationalName: '',
  breed: '',
  sex: '',
  birthDate: '',
  color: '',
  potential: '',
  ageGroup: 'puppy',
  description: '',
  status: 'on_sale',
  motherId: '',
  fatherId: '',
};

function dogToForm(dog: DogListRead): DogFormState {
  return {
    name: dog.name ?? '',
    internationalName: dog.internationalName ?? '',
    breed: dog.breed?.id ? String(dog.breed.id) : '',
    sex: dog.sex?.code ?? '',
    birthDate: dog.birthDate ?? '',
    color: dog.color ?? '',
    potential: dog.potential?.code ?? '',
    ageGroup: dog.ageGroup ?? 'puppy',
    description: dog.description ?? '',
    status: dog.status?.code ?? 'on_sale',
    motherId: dog.parents?.mother?.id ?? '',
    fatherId: dog.parents?.father?.id ?? '',
  };
}

export function DogCreateEditPage() {
  const { dogId } = useParams({ strict: false });
  const navigate = useNavigate();
  const showSuccess = useSuccess();
  const showError = useError();

  const isEdit = Boolean(dogId);
  const dogIdNum = dogId ? Number(dogId) : undefined;

  const { data: dog, isLoading: isDogLoading } = useV1NurseryDogsRetrieveQuery(
    { id: dogIdNum! },
    { skip: !isEdit || !dogIdNum },
  );

  const { data: breeds } = useGetBreedsQuery();
  const { data: allDogsData } = useV1NurseryDogsListQuery({
    limit: 500,
    offset: 0,
  });

  const [createDog] = useV1NurseryDogsCreateMutation();
  const [updateDog] = useV1NurseryDogsUpdateMutation();
  const [destroyDog] = useV1NurseryDogsDestroyMutation();
  const [uploadPhoto] = useNurseryUploadPhotoMutation();
  const [deletePhoto] = useV1NurseryDogsPhotosDestroyMutation();
  const [setMainPhoto] = useNurserySetMainPhotoMutation();
  const [uploadDocument] = useNurseryUploadDocumentMutation();
  const [deleteDocument] = useV1NurseryDogsDocumentsDestroyMutation();
  const [publishDog] = useNurseryPublishMutation();
  const [unpublishDog] = useNurseryUnpublishMutation();

  const [form, setForm] = useState<DogFormState>(INITIAL_FORM);
  const [photos, setPhotos] = useState<DogPhotosRead[]>([]);
  const [puppyCards, setPuppyCards] = useState<DogDocumentsRead[]>([]);
  const [vetPassports, setVetPassports] = useState<DogDocumentsRead[]>([]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const puppyCardInputRef = useRef<HTMLInputElement>(null);
  const vetPassportInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dog) {
      setForm(dogToForm(dog));
      setPhotos(dog.photos ?? []);
      setPuppyCards(
        dog.documents?.filter((d) => d.documentType === 'puppy_card') ?? [],
      );
      setVetPassports(
        dog.documents?.filter((d) => d.documentType === 'vet_passport') ?? [],
      );
    }
  }, [dog]);

  const breedOptions = useMemo(() => {
    if (!breeds) return [];
    return breeds.map((b) => ({ value: String(b.id), label: b.name }));
  }, [breeds]);

  const adultDogsOfBreed = useMemo(() => {
    if (!allDogsData?.results || !form.breed) return [];
    return allDogsData.results.filter(
      (d: DogListRead) =>
        d.ageGroup === 'adult' &&
        d.breed?.name ===
          breeds?.find((b) => String(b.id) === form.breed)?.name &&
        d.id !== dogIdNum,
    );
  }, [allDogsData, form.breed, breeds, dogIdNum]);

  const parentOptions = useMemo(() => {
    const opts = [{ value: '', label: '—' }];
    for (const d of adultDogsOfBreed) {
      opts.push({ value: String(d.id), label: d.name });
    }
    return opts;
  }, [adultDogsOfBreed]);

  const updateField = useCallback(
    <K extends keyof DogFormState>(key: K, value: DogFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      internationalName: form.internationalName || undefined,
      breed: Number(form.breed),
      sex: form.sex as 'male' | 'female',
      birthDate: form.birthDate,
      color: form.color,
      potential: form.potential as 'pet' | 'show' | 'breeding',
      ageGroup: form.ageGroup as 'puppy' | 'adult',
      description: form.description || undefined,
      status: form.status as 'on_sale' | 'booked' | 'sold',
      isPublished: dog?.isPublished ?? false,
      mother: form.motherId ? Number(form.motherId) : null,
      father: form.fatherId ? Number(form.fatherId) : null,
    };

    try {
      if (isEdit && dogIdNum) {
        await updateDog({ id: dogIdNum, dogAdminWrite: payload }).unwrap();
        showSuccess('Собака обновлена');
      } else {
        const created = await createDog({ dogAdminWrite: payload }).unwrap();
        showSuccess('Собака создана');
        const createdId = (created as { id?: number }).id;
        if (createdId) {
          navigate({
            to: '/cabinet/nursery/$dogId',
            params: { dogId: String(createdId) },
          });
        }
      }
    } catch {
      showError(isEdit ? 'Не удалось обновить' : 'Не удалось создать');
    }
  };

  const handleDelete = async () => {
    if (!dogIdNum) return;
    if (!window.confirm('Удалить собаку? Это действие нельзя отменить.'))
      return;
    try {
      await destroyDog({ id: dogIdNum }).unwrap();
      showSuccess('Собака удалена');
      navigate({ to: NURSERY_LIST_PATH });
    } catch {
      showError('Не удалось удалить');
    }
  };

  const handlePublishToggle = async () => {
    if (!dogIdNum) return;
    try {
      if (dog?.isPublished) {
        await unpublishDog({ id: dogIdNum }).unwrap();
        showSuccess('Снято с публикации');
      } else {
        await publishDog({ id: dogIdNum }).unwrap();
        showSuccess('Опубликовано');
      }
    } catch {
      showError('Не удалось изменить статус публикации');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !dogIdNum) return;
    for (const file of Array.from(files)) {
      try {
        const result = await uploadPhoto({
          id: dogIdNum,
          photo: file,
          isMain: photos.length === 0,
        }).unwrap();
        setPhotos((prev) => [
          ...prev,
          { id: result.id, url: result.url, isMain: result.isMain },
        ]);
      } catch {
        showError('Не удалось загрузить фото');
      }
    }
    e.target.value = '';
  };

  const handlePhotoDelete = async (photoId: number) => {
    if (!dogIdNum) return;
    try {
      await deletePhoto({ id: dogIdNum, photoId: String(photoId) }).unwrap();
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {
      showError('Не удалось удалить фото');
    }
  };

  const handleSetMainPhoto = async (photoId: number) => {
    if (!dogIdNum) return;
    try {
      await setMainPhoto({
        id: dogIdNum,
        photoId: String(photoId),
      }).unwrap();
      setPhotos((prev) =>
        prev.map((p) => ({ ...p, isMain: p.id === photoId })),
      );
    } catch {
      showError('Не удалось установить главное фото');
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'puppy_card' | 'vet_passport',
  ) => {
    const files = e.target.files;
    if (!files?.length || !dogIdNum) return;
    for (const file of Array.from(files)) {
      try {
        const result = await uploadDocument({
          id: dogIdNum,
          file,
          documentType: docType,
        }).unwrap();
        const newDoc: DogDocumentsRead = {
          id: result.id,
          name: result.name,
          documentType: docType,
          url: result.url,
        };
        if (docType === 'puppy_card') {
          setPuppyCards((prev) => [...prev, newDoc]);
        } else {
          setVetPassports((prev) => [...prev, newDoc]);
        }
      } catch {
        showError('Не удалось загрузить документ');
      }
    }
    e.target.value = '';
  };

  const handleDocumentDelete = async (
    docId: number,
    docType: 'puppy_card' | 'vet_passport',
  ) => {
    if (!dogIdNum) return;
    try {
      await deleteDocument({ id: dogIdNum, docId: String(docId) }).unwrap();
      if (docType === 'puppy_card') {
        setPuppyCards((prev) => prev.filter((d) => d.id !== docId));
      } else {
        setVetPassports((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch {
      showError('Не удалось удалить документ');
    }
  };

  if (isEdit && isDogLoading) return null;

  const pageTitle = isEdit ? (dog?.name ?? 'Питомец') : 'Новый питомец';

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link
          to={NURSERY_LIST_PATH}
          className={styles.backNav}
          aria-label="Назад"
        >
          <ArrowLeftIcon className={styles.backNavIcon} aria-hidden />
          <span className={styles.backNavLabel}>Назад</span>
        </Link>
      </header>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{pageTitle}</h2>
          {isEdit && (
            <div className={styles.titleActions}>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
                aria-label="Удалить"
              >
                <Delete />
              </button>
              <Button
                className={styles.publishBtn}
                onClick={handlePublishToggle}
              >
                {dog?.isPublished ? 'Снять с публикации' : 'Опубликовать'}
              </Button>
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Кличка"
            required
            value={form.name}
            maxLength={50}
            onChange={(e) => updateField('name', e.target.value)}
          />

          <Input
            label="Кличка (EN)"
            value={form.internationalName}
            maxLength={50}
            onChange={(e) => updateField('internationalName', e.target.value)}
          />

          <Select
            label="Порода"
            required
            options={breedOptions}
            value={form.breed}
            onChange={(v) => updateField('breed', v)}
            variant="input"
          />

          <Select
            label="Пол"
            required
            options={SEX_OPTIONS}
            value={form.sex}
            onChange={(v) => updateField('sex', v)}
            variant="input"
          />

          <DatePicker
            label="Дата рождения"
            required
            value={form.birthDate}
            onChange={(v) => updateField('birthDate', v)}
          />

          <Input
            label="Окрас"
            required
            value={form.color}
            maxLength={50}
            onChange={(e) => updateField('color', e.target.value)}
          />

          <Select
            label="Потенциал"
            options={POTENTIAL_OPTIONS}
            value={form.potential}
            onChange={(v) => updateField('potential', v)}
            variant="input"
          />

          <Select
            label="Тип"
            required
            options={AGE_GROUP_OPTIONS}
            value={form.ageGroup}
            onChange={(v) => updateField('ageGroup', v)}
            variant="input"
          />

          <TextArea
            label="Описание"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={6}
            maxLength={1000}
          />

          {/* Images section — only for saved dogs */}
          {isEdit && dogIdNum && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Изображения</h3>
              <div className={styles.imagesGrid}>
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`${styles.imageItem} ${photo.isMain ? styles.imageItem_main : ''}`}
                  >
                    <img
                      className={styles.imageItemImg}
                      src={photo.url}
                      alt=""
                      onClick={() => handleSetMainPhoto(photo.id)}
                      title="Нажмите для установки как основное"
                    />
                    <button
                      type="button"
                      className={styles.imageDeleteBtn}
                      onClick={() => handlePhotoDelete(photo.id)}
                      aria-label="Удалить фото"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePhotoUpload}
              />
              <Button
                type="button"
                variant="primary"
                className={styles.uploadBtn}
                onClick={() => photoInputRef.current?.click()}
              >
                Загрузить изображение
              </Button>
            </div>
          )}

          <Select
            label="Статус"
            required
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(v) => updateField('status', v)}
            variant="input"
          />

          {/* Parents */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Родители</h3>
            <Select
              label="Мать"
              options={parentOptions}
              value={form.motherId}
              onChange={(v) => updateField('motherId', v)}
              variant="input"
            />
            <Select
              label="Отец"
              options={parentOptions}
              value={form.fatherId}
              onChange={(v) => updateField('fatherId', v)}
              variant="input"
            />
          </div>

          {/* Documents — only for saved dogs */}
          {isEdit && dogIdNum && (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Щенячья карточка</h3>
                {puppyCards.map((doc) => (
                  <div key={doc.id} className={styles.documentItem}>
                    <div className={styles.documentName}>
                      <span>{doc.name}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.documentDeleteBtn}
                      onClick={() => handleDocumentDelete(doc.id, 'puppy_card')}
                      aria-label="Удалить документ"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                      </svg>
                    </button>
                  </div>
                ))}
                <input
                  ref={puppyCardInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => handleDocumentUpload(e, 'puppy_card')}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.uploadBtn}
                  onClick={() => puppyCardInputRef.current?.click()}
                >
                  Загрузить документ
                </Button>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ветеринарный паспорт</h3>
                {vetPassports.map((doc) => (
                  <div key={doc.id} className={styles.documentItem}>
                    <div className={styles.documentName}>
                      <span>{doc.name}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.documentDeleteBtn}
                      onClick={() =>
                        handleDocumentDelete(doc.id, 'vet_passport')
                      }
                      aria-label="Удалить документ"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                      </svg>
                    </button>
                  </div>
                ))}
                <input
                  ref={vetPassportInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => handleDocumentUpload(e, 'vet_passport')}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.uploadBtn}
                  onClick={() => vetPassportInputRef.current?.click()}
                >
                  Загрузить документ
                </Button>
              </div>
            </>
          )}

          <Button type="submit" variant="crm" className={styles.submitBtn}>
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );
}
