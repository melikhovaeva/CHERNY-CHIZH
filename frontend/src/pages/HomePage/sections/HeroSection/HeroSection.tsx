import styles from './HeroSection.module.scss'

export function HeroSection() {
  return (
    <section className={styles.root}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Чемпионы ринга и верные друзья</h1>
        <p className={styles.description}>
          Наши собаки уверенно чувствуют себя на ринге и остаются надёжными
          компаньонами дома
        </p>
      </div>
      <ul className={styles.list}>
        {Array.from({ length: 4 }).map((_, index) => (
          <li className={styles.listItem} key={index} />
        ))}
      </ul>
    </section>
  )
}
