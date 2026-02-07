import { useBookingModal } from '@/app/contexts/BookingModalContext'
import type { Puppy } from '@/entities/puppy'
import {
  getPuppyMainPhotoUrl,
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
  const mainPhotoUrl = getPuppyMainPhotoUrl(puppy)
  const { openBookingModal } = useBookingModal()

  return (
    <div className={cn([styles.root, className || ''])}>
      <div className={styles.imageSection}>
        <img
          className={styles.image}
          src={mainPhotoUrl}
          alt={puppy.name}
        />
      </div>
      <div className={styles.contentSection}>
        <PuppyCharacteristics puppy={puppy} className={styles.characteristics} />
        <Button className={styles.button} onClick={openBookingModal}>
          Забронировать
        </Button>
      </div>
    </div>
  )
}
