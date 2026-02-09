import type { Puppy } from '../../model/types'
import { formatPuppyDate } from '../../model/utils'
import styles from './PuppyCharacteristics.module.scss'

interface PuppyCharacteristicsProps {
  puppy: Puppy
  className?: string
}

export const PuppyCharacteristics = ({ puppy, className }: PuppyCharacteristicsProps) => {

  const documentsExists = puppy.documents && puppy.documents?.length > 0

  return (
    <dl className={[styles.list, className].filter(Boolean).join(' ')}>
      <div className={styles.item}>
        <dt className={styles.label}>Статус:</dt>
        <dd className={styles.value}>{puppy.status.label}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Дата рождения:</dt>
        <dd className={styles.value}>{formatPuppyDate(puppy.birthDate)}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Пол:</dt>
        <dd className={styles.value}>{puppy.sex.label}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Окрас:</dt>
        <dd className={styles.value}>{puppy.color}</dd>
      </div>
      {documentsExists && (
        <div className={styles.item}>
          <dt className={styles.label}>Документы:</dt>
          <dd className={styles.value}>
            {
              puppy.documents?.map((document) => (

                document.url ? (
                  <a key={document.id}
                    className={styles.value__link}
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {document.name}
                  </a>
                ) : (
                  <span key={document.id}>{document.name}</span>
                )
              ))
            }
          </dd>
        </div>
      )}
      <div className={styles.item}>
        <dt className={styles.label}>Потенциал:</dt>
        <dd className={styles.value}>{puppy.potential.label}</dd>
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
    </dl >
  )
}
