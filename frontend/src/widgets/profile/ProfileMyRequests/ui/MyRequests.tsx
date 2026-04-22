import {
  useV1RequestsListQuery,
  type RequestRead,
} from '@/shared/api/generated/requests.generated';
import styles from './MyRequests.module.scss';

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_work: 'В работе',
  closed: 'Закрыта',
  rejected: 'Отклонена',
};

const TYPE_LABELS: Record<string, string> = {
  consultation: 'Консультация',
  booking: 'Бронирование',
  waiting_list: 'Лист ожидания',
};

const STATUS_MOD: Record<string, string> = {
  new: styles.badge_new,
  in_work: styles.badge_inWork,
  closed: styles.badge_closed,
  rejected: styles.badge_rejected,
};

const TYPE_MOD: Record<string, string> = {
  consultation: styles.badge_consultation,
  booking: styles.badge_booking,
  waiting_list: styles.badge_waitingList,
};

function formatDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('ru-RU');
}

export function MyRequests() {
  const { data: requests, isLoading } = useV1RequestsListQuery();

  if (isLoading) return <div className={styles.empty}>Загрузка...</div>;
  if (!requests?.length) {
    return <div className={styles.empty}>У вас пока нет заявок</div>;
  }

  return (
    <div className={styles.root}>
      {requests.map((req: RequestRead) => (
        <div key={req.id} className={styles.card}>
          <div className={styles.header}>
            <span className={styles.id}>Заявка #{req.id}</span>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${STATUS_MOD[req.status] ?? ''}`}>
                {STATUS_LABELS[req.status] ?? req.status}
              </span>
              <span className={`${styles.badge} ${TYPE_MOD[req.requestType] ?? ''}`}>
                {TYPE_LABELS[req.requestType] ?? req.requestType}
              </span>
            </div>
          </div>

          {req.dog && (
            <div className={styles.row}>
              <span className={styles.label}>Собака:</span>
              <span className={styles.value}>{req.dog.name}</span>
            </div>
          )}

          {req.message && (
            <div className={styles.message}>{req.message}</div>
          )}

          <div className={styles.footer}>
            <span className={styles.meta}>Создано: {formatDate(req.createdAt)}</span>
            {req.plannedDate && (
              <span className={styles.meta}>План: {formatDate(req.plannedDate)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
