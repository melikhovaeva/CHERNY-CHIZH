import type { Puppy } from '../../model/types'
import {
  formatPuppyDocuments
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
      <dd className={styles.value}>{puppy.status.label}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Дата рождения:</dt>
      <dd className={styles.value}>{puppy.birthDate}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Пол:</dt>
      <dd className={styles.value}>{puppy.sex.label}</dd>
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
      <dd className={styles.value}>{puppy.potential?.label ?? 'Не указан'}</dd>
    </div>
    <div className={styles.item}>
      <dt className={styles.label}>Родители:</dt>
      <dd className={styles.value}>
        {puppy.parents?.map((parent, index) => (
          <span key={parent.id}>
            {index > 0 && <br />}
            {parent.name}
          </span>
        ))}
      </dd>
    </div>
  </dl>
)
