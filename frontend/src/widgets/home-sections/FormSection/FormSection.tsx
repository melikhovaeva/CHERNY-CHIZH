import { Form } from '@/shared/ui/components'
import styles from './FormSection.module.scss'

const SECTION_TITLE = 'Мы всегда рады помочь'
const SECTION_SUBTITLE =
  'Остались вопросы? Свяжитесь с нами через форму ниже'

export function FormSection() {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{SECTION_TITLE}</h2>
      <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
      <Form />

    </section >
  )
}
