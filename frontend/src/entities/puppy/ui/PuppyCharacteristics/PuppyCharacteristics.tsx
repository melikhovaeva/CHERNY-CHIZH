import type { Puppy } from '../../model/types'
import {
  formatPuppyDate,
  formatPuppyDocuments,
  formatPuppySex,
} from '../../model/utils'
import styles from './PuppyCharacteristics.module.scss'

interface PuppyCharacteristicsProps {
  puppy: Puppy
  className?: string
}

export const PuppyCharacteristics = ({ puppy, className }: PuppyCharacteristicsProps) => (
  <dl className={[styles.list, className].filter(Boolean).join(' ')}>
    <div className={styles.item}>
      <dt className={styles.label}>Статус:</dt>
      <dd className={styles.value}>{puppy.status.name}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Дата рождения:</dt>
      <dd className={styles.value}>{formatPuppyDate(puppy.birthDate)}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Пол:</dt>
      <dd className={styles.value}>{formatPuppySex(puppy.sex)}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Окрас:</dt>
      <dd className={styles.value}>{puppy.color}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Документы:</dt>
      <dd className={styles.value}>{formatPuppyDocuments(puppy.documents)}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Потенциал:</dt>
      <dd className={styles.value}>{puppy.potential ?? 'Не указан'}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Родители:</dt>
      <dd className={styles.value}>
        {puppy.parents.map((parent, index) => (
          <span key={parent.uid}>
            {index > 0 && <br />}
            {parent.name}
          </span>
        ))}
      </dd>
    </div>
  </dl>
)
