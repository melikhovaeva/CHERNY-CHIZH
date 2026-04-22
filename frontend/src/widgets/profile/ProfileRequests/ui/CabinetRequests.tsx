import {
  useV1RequestsListQuery,
  type RequestRead,
  type RequestStatus,
  type RequestType,
} from '@/shared/api/generated/requests.generated';
import { Button, Select } from '@/shared/ui/components';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './CabinetRequests.module.scss';
import { RequestCard } from './RequestCard';

const STATUS_OPTIONS = [
  { value: '', label: 'Статус заявки' },
  { value: 'new', label: 'Новая' },
  { value: 'in_work', label: 'В работе' },
  { value: 'closed', label: 'Закрыта' },
  { value: 'rejected', label: 'Отклонена' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'Тип заявки' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'booking', label: 'Бронирование' },
  { value: 'waiting_list', label: 'Лист ожидания' },
];

export function CabinetRequests() {
  const navigate = useNavigate();
  const location = useLocation();

  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const isNestedRoute =
    location.pathname.startsWith('/cabinet/requests/') &&
    location.pathname !== '/cabinet/requests';

  const { data: requests, isLoading } = useV1RequestsListQuery(
    {
      status: (statusFilter as RequestStatus) || undefined,
      requestType: (typeFilter as RequestType) || undefined,
    },
    { skip: isNestedRoute },
  );

  if (isNestedRoute) {
    return <Outlet />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <Select
            label="Тип заявки"
            options={TYPE_OPTIONS}
            variant="input"
            value={typeFilter}
            onChange={setTypeFilter}
            className={styles.filterSelect}
          />
          <Select
            label="Статус заявки"
            options={STATUS_OPTIONS}
            variant="input"
            value={statusFilter}
            onChange={setStatusFilter}
            className={styles.filterSelect}
          />
        </div>
        <Button
          variant="crm"
          className={styles.createBtn}
          onClick={() => navigate({ to: '/cabinet/requests/new' })}
        >
          Создать заявку
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.empty}>Загрузка...</div>
      ) : !requests?.length ? (
        <div className={styles.empty}>Заявки не найдены</div>
      ) : (
        <div className={styles.grid}>
          {requests.map((req: RequestRead) => (
            <RequestCard
              key={req.id}
              request={req}
              onClick={() =>
                navigate({
                  to: '/cabinet/requests/$requestId',
                  params: { requestId: String(req.id) },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
