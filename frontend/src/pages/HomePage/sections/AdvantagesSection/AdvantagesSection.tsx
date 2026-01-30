import styles from './AdvantagesSection.module.scss'

const advantages = [
  {
    title: 'Гарантия качества',
    description: 'Мы следим за условиями содержания каждого питомца',
    image: '/advantages/guarantee.svg',
  },
  {
    title: 'Документы',
    description: 'Полный пакет документов, включая родословную РКФ FCI',
    image: '/advantages/documents.svg',
  },
  {
    title: 'Выдающиеся результаты',
    description: 'Множество выставочных собак, ставших чемпионами разных стран',
    image: '/advantages/results.svg',
  },
  {
    title: 'Мировая доставка',
    description: 'Мы осуществляем доставку по всему миру',
    image: '/advantages/delivery.svg',
  },
]

export function AdvantagesSection() {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Почему мы - лучший выбор</h2>
      <ul className={styles.list}>
        {advantages.map((advantage) => (
          <li className={styles.item} key={advantage.title}>
            <img
              className={styles.itemImage}
              src={advantage.image}
              alt={advantage.title}
            />
            <div className={styles.itemContent}>
              <h4 className={styles.itemTitle}>{advantage.title}</h4>
              <p className={styles.itemDescription}>{advantage.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
