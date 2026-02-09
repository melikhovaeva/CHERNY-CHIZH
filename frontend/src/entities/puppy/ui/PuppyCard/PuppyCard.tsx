import { openBookingModal, useAppDispatch } from '@/app/redux'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import { useNavigate } from '@tanstack/react-router'
import type { Puppy } from '../../model/types'
import {
  getFirstPhotoUrl
} from '../../model/utils'
import { PuppyCharacteristics } from '../PuppyCharacteristics'
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
          src={getFirstPhotoUrl(puppy)}
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
        <PuppyCharacteristics puppy={puppy} />
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
