import type { Puppy } from '../../model/types'
import styles from './PuppyGallery.module.scss'

interface PuppyGalleryProps {
  puppy: Puppy
  className?: string
}

export const PuppyGallery = ({ puppy, className }: PuppyGalleryProps) => (
  <div className={[styles.gallery, className].filter(Boolean).join(' ')}>
    {(puppy.photos ?? []).map((photo) => (
      <div key={photo.id} className={styles.item}>
        <img
          className={styles.image}
          src={photo.url}
          alt={puppy.name}
        />
      </div>
    ))}
  </div>
)
