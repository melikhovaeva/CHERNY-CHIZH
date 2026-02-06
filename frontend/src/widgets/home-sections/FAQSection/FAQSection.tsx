import { FAQ_ITEMS } from '@/entities/faq'
import { Accordion, type AccordionItem } from '@/shared/ui/components'
import styles from './FAQSection.module.scss'

const SECTION_TITLE = 'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ'
const SECTION_SUBTITLE =
  'Если у вас остались вопросы, свяжитесь с нами удобным способом'

export function FAQSection() {
  const accordionItems: AccordionItem[] = FAQ_ITEMS.map((item) => ({
    id: item.id,
    title: item.title,
    content: <p className={styles.answer}>{item.content}</p>,
  }))

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{SECTION_TITLE}</h2>
      <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
      <Accordion
        items={accordionItems}
        defaultOpenId={FAQ_ITEMS[0]?.id}
      />
    </section >
  )
}
