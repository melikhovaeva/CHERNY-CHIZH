import type { RequestRead } from '@/shared/api/generated/requests.generated';
import styles from './RequestCard.module.scss';

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

interface RequestCardProps {
  request: RequestRead;
  onClick: () => void;
}

function formatDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('ru-RU');
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <span className={styles.id}>Заявка #{request.id}</span>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${STATUS_MOD[request.status] ?? ''}`}>
            {STATUS_LABELS[request.status] ?? request.status}
          </span>
          <span className={`${styles.badge} ${TYPE_MOD[request.requestType] ?? ''}`}>
            {TYPE_LABELS[request.requestType] ?? request.requestType}
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>Клиент:</span>
          <span className={styles.value}>{request.firstName}{request.lastName ? ` ${request.lastName}` : ''}</span>
        </div>
        {request.dog && (
          <div className={styles.row}>
            <span className={styles.label}>Собака:</span>
            <span className={styles.value}>{request.dog.name}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.meta}>
          Создано: {formatDate(request.createdAt)}
        </span>
        {request.plannedDate && (
          <span className={styles.meta}>
            План: {formatDate(request.plannedDate)}
          </span>
        )}
      </div>
    </div>
  );
}
