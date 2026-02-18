import styles from './AppearanceCard.module.scss'

interface AppearanceCardProps {
  title: string
  text: string
}

export const AppearanceCard = ({ title, text }: AppearanceCardProps) => {
  return (
    <div
      className={styles.root}
    >
      <h4>{title}</h4>
      <p className={styles.text}>{text}</p>
    </div >
  )
}
