import { FaqAccordion } from '@/features';
import styles from './DeliverySection.module.scss';

const SECTION_TITLE = 'Доставка в любую точку';

export function DeliverySection() {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <h2 className={styles.title}>{SECTION_TITLE}</h2>
        <FaqAccordion category="delivery" />
      </div>
    </section>
  );
}

