import {
  PUPPY_GENDER_OPTIONS,
  PUPPY_POTENTIAL_OPTIONS,
  PUPPY_STATUS_OPTIONS,
} from '@/entities/puppy'
import { Select } from '@/shared/ui/components'
import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
import styles from './PuppiesFilters.module.scss'

interface PuppiesFiltersProps {
  className?: string
}

const genderOptions = [...PUPPY_GENDER_OPTIONS]
const potentialOptions = [...PUPPY_POTENTIAL_OPTIONS]
const statusOptions = [...PUPPY_STATUS_OPTIONS]

export function PuppiesFilters({ className }: PuppiesFiltersProps) {
  const [gender, setGender] = useState('all')
  const [potential, setPotential] = useState('all')
  const [status, setStatus] = useState('all')

  return (
    <div className={cn([styles.root, className || ''])}>
      <Select
        label="Пол"
        options={genderOptions}
        value={gender}
        onChange={setGender}
      />
      <Select
        label="Потенциал"
        options={potentialOptions}
        value={potential}
        onChange={setPotential}
      />
      <Select
        label="Статус"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />
    </div>
  )
}
