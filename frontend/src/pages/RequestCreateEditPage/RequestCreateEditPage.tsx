import { useGetBreedsQuery } from '@/entities/breed';
import { useV1NurseryDogsListQuery } from '@/entities/nursery-dog';
import type {
  PatchedRequest,
  PrepaymentStatus,
  RequestStatus,
  RequestType,
} from '@/shared/api/generated/requests.generated';
import {
  useV1RequestsCreateMutation,
  useV1RequestsDestroyMutation,
  useV1RequestsPartialUpdateMutation,
  useV1RequestsRetrieveQuery,
} from '@/shared/api/generated/requests.generated';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './RequestCreateEditPage.module.scss';

const REQUESTS_LIST_PATH = '/cabinet/requests' as const;

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'in_work', label: 'В работе' },
  { value: 'closed', label: 'Закрыта' },
  { value: 'rejected', label: 'Отклонена' },
];

const TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: 'consultation', label: 'Консультация' },
  { value: 'booking', label: 'Бронирование' },
  { value: 'waiting_list', label: 'Лист ожидания' },
];

const PREPAYMENT_OPTIONS: { value: PrepaymentStatus; label: string }[] = [
  { value: 'not_paid', label: 'Не внесена' },
  { value: 'paid', label: 'Да' },
];

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  messenger: string;
  message: string;
  status: RequestStatus;
  requestType: RequestType;
  dogId: string;
  prepaymentStatus: PrepaymentStatus;
  prepaymentAmount: string;
  plannedDate: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  breedId: string;
  comment: string;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  messenger: '',
  message: '',
  status: 'new',
  requestType: 'consultation',
  dogId: '',
  prepaymentStatus: 'not_paid',
  prepaymentAmount: '',
  plannedDate: '',
  city: '',
  street: '',
  house: '',
  apartment: '',
  breedId: '',
  comment: '',
};

export function RequestCreateEditPage() {
  const { requestId } = useParams({ strict: false });
  const navigate = useNavigate();
  const showSuccess = useSuccess();
  const showError = useError();

  const isEdit = Boolean(requestId);
  const requestIdNum = requestId ? Number(requestId) : undefined;

  const { data: existing, isLoading: isExistingLoading } =
    useV1RequestsRetrieveQuery(
      { id: requestIdNum! },
      { skip: !isEdit || !requestIdNum },
    );

  const { data: breeds } = useGetBreedsQuery();
  const { data: dogsData } = useV1NurseryDogsListQuery({ limit: 500, offset: 0 });

  const [createRequest] = useV1RequestsCreateMutation();
  const [updateRequest] = useV1RequestsPartialUpdateMutation();
  const [destroyRequest] = useV1RequestsDestroyMutation();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  useEffect(() => {
    if (existing) {
      setForm({
        firstName: existing.firstName ?? '',
        lastName: existing.lastName ?? '',
        phone: existing.phone ?? '',
        messenger: existing.messenger ?? '',
        message: existing.message ?? '',
        status: existing.status,
        requestType: existing.requestType,
        dogId: existing.dog ? String(existing.dog.id) : '',
        prepaymentStatus: existing.prepaymentStatus ?? 'not_paid',
        prepaymentAmount: existing.prepaymentAmount ?? '',
        plannedDate: existing.plannedDate ?? '',
        city: existing.city ?? '',
        street: existing.street ?? '',
        house: existing.house ?? '',
        apartment: existing.apartment ?? '',
        breedId: existing.breed ? String(existing.breed.id) : '',
        comment: existing.comment ?? '',
      });
    }
  }, [existing]);

  const breedOptions = useMemo(() => {
    const opts = [{ value: '', label: '—' }];
    if (breeds) {
      for (const b of breeds) {
        opts.push({ value: String(b.id), label: b.name });
      }
    }
    return opts;
  }, [breeds]);

  const dogOptions = useMemo(() => {
    const opts = [{ value: '', label: 'Введите кличку собаки' }];
    if (dogsData?.results) {
      for (const d of dogsData.results) {
        opts.push({ value: String(d.id), label: d.name });
      }
    }
    return opts;
  }, [dogsData]);

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PatchedRequest = {
      firstName: form.firstName || undefined,
      lastName: form.lastName || null,
      phone: form.phone || undefined,
      messenger: form.messenger || undefined,
      message: form.message || undefined,
      status: form.status,
      requestType: form.requestType,
      dog: form.dogId ? Number(form.dogId) : null,
      prepaymentStatus: form.prepaymentStatus,
      prepaymentAmount: form.prepaymentAmount || null,
      plannedDate: form.plannedDate || null,
      city: form.city || null,
      street: form.street || null,
      house: form.house || null,
      apartment: form.apartment || null,
      breed: form.breedId ? Number(form.breedId) : null,
      comment: form.comment || null,
    };

    try {
      if (isEdit && requestIdNum) {
        await updateRequest({ id: requestIdNum, patchedRequest: payload }).unwrap();
        showSuccess('Заявка обновлена');
      } else {
        const created = await createRequest({
          request: {
            firstName: form.firstName,
            lastName: form.lastName || null,
            phone: form.phone,
            messenger: form.messenger,
            message: form.message,
            status: form.status,
            requestType: form.requestType,
            dog: form.dogId ? Number(form.dogId) : null,
            prepaymentStatus: form.prepaymentStatus,
            prepaymentAmount: form.prepaymentAmount || null,
            plannedDate: form.plannedDate || null,
            city: form.city || null,
            street: form.street || null,
            house: form.house || null,
            apartment: form.apartment || null,
            breed: form.breedId ? Number(form.breedId) : null,
            comment: form.comment || null,
          },
        }).unwrap();
        showSuccess('Заявка создана');
        navigate({
          to: '/cabinet/requests/$requestId',
          params: { requestId: String(created.id) },
        });
      }
    } catch {
      showError(isEdit ? 'Не удалось обновить' : 'Не удалось создать');
    }
  };

  const handleDelete = async () => {
    if (!requestIdNum) return;
    if (!window.confirm('Удалить заявку? Это действие нельзя отменить.')) return;
    try {
      await destroyRequest({ id: requestIdNum }).unwrap();
      showSuccess('Заявка удалена');
      navigate({ to: REQUESTS_LIST_PATH });
    } catch {
      showError('Не удалось удалить');
    }
  };

  if (isEdit && isExistingLoading) return null;

  const pageTitle = isEdit ? `Заявка #${requestIdNum}` : 'Новая заявка';
  const showBookingFields = form.requestType === 'booking';
  const showWaitingListFields = form.requestType === 'waiting_list';
  const showAddressFields = showBookingFields && form.prepaymentStatus === 'paid';

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to={REQUESTS_LIST_PATH} className={styles.backNav} aria-label="Назад">
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
                type="button"
                variant="primary"
                className={styles.saveTopBtn}
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              >
                Сохранить
              </Button>
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Client info */}
          <h3 className={styles.sectionTitle}>Информация о клиенте</h3>

          <Input
            label="Имя клиента"
            required
            value={form.firstName}
            maxLength={255}
            onChange={(e) => updateField('firstName', e.target.value)}
          />

          <div className={styles.row}>
            <Input
              label="Номер телефона"
              value={form.phone}
              maxLength={32}
              onChange={(e) => updateField('phone', e.target.value)}
              className={styles.flex1}
            />
            <Input
              label="Способ связи"
              value={form.messenger}
              maxLength={255}
              onChange={(e) => updateField('messenger', e.target.value)}
              className={styles.flex1}
            />
          </div>

          <TextArea
            label="Пожелания клиента"
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            rows={4}
          />

          {/* Status */}
          <h3 className={styles.sectionTitle}>Статус</h3>
          <div className={styles.toggleGroup}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.toggleBtn} ${form.status === opt.value ? styles.toggleBtn_active : ''}`}
                onClick={() => updateField('status', opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Type */}
          <h3 className={styles.sectionTitle}>Тип заявки</h3>
          <div className={styles.toggleGroup}>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.toggleBtn} ${form.requestType === opt.value ? styles.toggleBtn_active : ''}`}
                onClick={() => updateField('requestType', opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Booking fields */}
          {showBookingFields && (
            <>
              <Select
                label="Собака *"
                options={dogOptions}
                variant="input"
                value={form.dogId}
                onChange={(v) => updateField('dogId', v)}
              />

              <h3 className={styles.sectionTitle}>Предоплата</h3>
              <Select
                label="Предоплата"
                options={PREPAYMENT_OPTIONS}
                variant="input"
                value={form.prepaymentStatus}
                onChange={(v) => updateField('prepaymentStatus', v as PrepaymentStatus)}
              />
              <Input
                label="Стоимость предоплаты"
                value={form.prepaymentAmount}
                placeholder="Введите сумму"
                onChange={(e) => updateField('prepaymentAmount', e.target.value)}
              />

              {showAddressFields && (
                <>
                  <h3 className={styles.sectionTitle}>Адрес</h3>
                  <div className={styles.row}>
                    <Input
                      label="Город"
                      value={form.city}
                      placeholder="Введите город"
                      onChange={(e) => updateField('city', e.target.value)}
                      className={styles.flex1}
                    />
                    <Input
                      label="Улица"
                      value={form.street}
                      placeholder="Введите адрес доставки"
                      onChange={(e) => updateField('street', e.target.value)}
                      className={styles.flex1}
                    />
                  </div>
                  <div className={styles.row}>
                    <Input
                      label="Дом"
                      value={form.house}
                      placeholder="Введите город"
                      onChange={(e) => updateField('house', e.target.value)}
                      className={styles.flex1}
                    />
                    <Input
                      label="Квартира"
                      value={form.apartment}
                      placeholder="Введите адрес доставки"
                      onChange={(e) => updateField('apartment', e.target.value)}
                      className={styles.flex1}
                    />
                  </div>
                </>
              )}

              <DatePicker
                label="Планируемая дата"
                value={form.plannedDate}
                onChange={(v) => updateField('plannedDate', v)}
              />
            </>
          )}

          {/* Waiting list fields */}
          {showWaitingListFields && (
            <Select
              label="Порода"
              options={breedOptions}
              variant="input"
              value={form.breedId}
              onChange={(v) => updateField('breedId', v)}
            />
          )}

          {/* Comment — always shown */}
          <TextArea
            label="Комментарий"
            value={form.comment}
            placeholder="Введите комментарий"
            onChange={(e) => updateField('comment', e.target.value)}
            rows={4}
          />

          <Button type="submit" variant="crm" className={styles.submitBtn}>
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );
}
