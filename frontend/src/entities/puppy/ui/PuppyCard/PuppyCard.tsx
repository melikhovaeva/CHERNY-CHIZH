import { openBookingModal, useAppDispatch } from '@/app/redux'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import { useNavigate } from '@tanstack/react-router'
import type { Puppy } from '../../model/types'
import {
  formatPuppyDate,
  formatPuppyDocuments,
} from '../../model/utils'
import styles from './PuppyCard.module.scss'

interface PuppyCardProps {
  puppy: Puppy
  className?: string
  detailed?: boolean
}

export const PuppyCard = ({ puppy, className, detailed = false }: PuppyCardProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const goToDetails = () => {
    navigate({
      to: '/puppies/$breedId/$puppyId',
      params: { breedId: puppy.breed.slug, puppyId: String(puppy.id) },
    })
  }

  return (
    <div className={cn([styles.card, className || ''])}>
      <div className={styles.card__imageSection}>
        <img
          className={styles.card__image}
          src={'placeholder.webp'}
          alt={puppy.name}
        />
      </div>
      <div className={styles.card__contentSection}>
        {!detailed ? (
          <div>
            <h4 className={styles.card__title}>{puppy.name}</h4>
            {puppy.internationalName && <p className={styles.card__subtitle}>{puppy.internationalName}</p>}
          </div>) :
          (<h4 className={styles.card__title}>Характеристики</h4>)}
        <dl className={styles.card__characteristics}>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Статус:</dt>
            <dd className={styles.card__characteristicValue}>
              {puppy.status.label}
            </dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Дата рождения:</dt>
            <dd className={styles.card__characteristicValue}>
              {formatPuppyDate(puppy.birthDate)}
            </dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Пол:</dt>
            <dd className={styles.card__characteristicValue}>
              {puppy.sex.label}
            </dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Окрас:</dt>
            <dd className={styles.card__characteristicValue}>{puppy.color}</dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Документы:</dt>
            <dd className={styles.card__characteristicValue}>
              {formatPuppyDocuments(puppy.documents ?? [])}
            </dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Потенциал:</dt>
            <dd className={styles.card__characteristicValue}>
              {puppy.potential?.label ?? 'Не указан'}
            </dd>
          </div>
          <div className={styles.card__characteristic}>
            <dt className={styles.card__characteristicLabel}>Родители:</dt>
            <dd className={styles.card__characteristicValue}>
              {(puppy.parents ?? []).map((parent, index) => (
                <span key={parent.id}>
                  {index > 0 && <br />}
                  {parent.name}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div className={styles.card__buttonContainer}>
          <Button onClick={() => dispatch(openBookingModal())}>Забронировать</Button>
          {!detailed && (
            <Button variant="secondary" onClick={goToDetails}>
              Подробнее
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
