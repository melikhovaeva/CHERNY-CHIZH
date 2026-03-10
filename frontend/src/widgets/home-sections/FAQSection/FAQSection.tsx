import { FaqAccordion } from '@/features';
import styles from './FAQSection.module.scss';

const SECTION_TITLE = 'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ';
const SECTION_SUBTITLE =
  'Если у вас остались вопросы, свяжитесь с нами удобным способом';

export function FAQSection() {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <h2 className={styles.title}>{SECTION_TITLE}</h2>
        <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
        <FaqAccordion category="general" />
      </div>
    </section>
  );
}
