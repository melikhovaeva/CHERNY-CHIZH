import { PawRating } from '@/features'
import styles from './FeatureCard.module.scss'

interface FeatureCardProps {
  title: string
  text: string
  rating: number
}
export const FeatureCard = ({ title, text, rating }: FeatureCardProps) => {
  return (
    <div className={styles.root}>
      <div>
        <h4>{title}</h4>
        <PawRating value={rating} />
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
