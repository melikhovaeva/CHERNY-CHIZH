import { openBookingModal, useAppDispatch } from '@/app/redux'
import type { Puppy } from '@/entities/puppy'
import {
  PuppyCharacteristics,
} from '@/entities/puppy'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/components'
import styles from './PuppyDetails.module.scss'

interface PuppyDetailsProps {
  puppy: Puppy
  className?: string
}

export function PuppyDetails({ puppy, className }: PuppyDetailsProps) {
  const dispatch = useAppDispatch()

  return (
    <div className={cn([styles.root, className || ''])}>
      <div className={styles.imageSection}>
        <img
          className={styles.image}
          src={'placeholder.webp'}
          alt={puppy.name}
        />
      </div>
      <div className={styles.contentSection}>
        <PuppyCharacteristics puppy={puppy} className={styles.characteristics} />
        <Button className={styles.button} onClick={() => dispatch(openBookingModal())}>
          Забронировать
        </Button>
      </div>
    </div>
  )
}
