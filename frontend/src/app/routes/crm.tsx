import { createFileRoute } from '@tanstack/react-router';
import styles from './crm.module.scss';

function CrmPage() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>CRM</h1>
      <p className={styles.description}>
        Админ-раздел теперь встроен в единый фронтенд и доступен по маршруту
        `/crm`.
      </p>
    </section>
  );
}

export const Route = createFileRoute('/crm')({
  component: CrmPage,
  staticData: {
    navLabel: 'CRM',
    navOrder: 90,
  },
});
