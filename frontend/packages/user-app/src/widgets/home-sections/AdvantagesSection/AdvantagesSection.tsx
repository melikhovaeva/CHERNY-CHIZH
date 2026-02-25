import type { FunctionComponent, SVGProps } from 'react'
import DeliveryIcon from './assets/delivery.svg?react'
import DocumentsIcon from './assets/documents.svg?react'
import GuaranteeIcon from './assets/guarantee.svg?react'
import ResultsIcon from './assets/results.svg?react'
import styles from './AdvantagesSection.module.scss'

const advantages: Array<{
  title: string
  description: string
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>
}> = [
  {
    title: 'Гарантия качества',
    description: 'Мы следим за условиями содержания каждого питомца',
    Icon: GuaranteeIcon,
  },
  {
    title: 'Документы',
    description: 'Полный пакет документов, включая родословную РКФ FCI',
    Icon: DocumentsIcon,
  },
  {
    title: 'Выдающиеся результаты',
    description: 'Множество выставочных собак, ставших чемпионами разных стран',
    Icon: ResultsIcon,
  },
  {
    title: 'Мировая доставка',
    description: 'Мы осуществляем доставку по всему миру',
    Icon: DeliveryIcon,
  },
]

export function AdvantagesSection() {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Почему мы - лучший выбор</h2>
      <ul className={styles.list}>
        {advantages.map((advantage) => {
          const Icon = advantage.Icon
          return (
          <li className={styles.item} key={advantage.title}>
            <Icon
              className={styles.itemImage}
              aria-hidden
            />
            <div className={styles.itemContent}>
              <h4 className={styles.itemTitle}>{advantage.title}</h4>
              <p className={styles.itemDescription}>{advantage.description}</p>
            </div>
          </li>
          )
        })}
      </ul>
    </section>
  )
}
