import { Link } from '@tanstack/react-router'
import type { Puppy } from '../../model/types'
import styles from './PuppyParents.module.scss'

interface PuppyParentsProps {
  puppy: Puppy
  className?: string
}

export const PuppyParents = ({ puppy, className }: PuppyParentsProps) => (
  <ul className={[styles.list, className].filter(Boolean).join(' ')}>
    {puppy.parents.map((parent) => (
      <li key={parent.uid} className={styles.item}>
        <Link to={parent.url} className={styles.link}>
          {parent.name}
        </Link>
      </li>
    ))}
  </ul>
)
