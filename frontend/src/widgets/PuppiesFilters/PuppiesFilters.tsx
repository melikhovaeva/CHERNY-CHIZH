import {
  PUPPY_GENDER_OPTIONS,
  PUPPY_POTENTIAL_OPTIONS,
  PUPPY_STATUS_OPTIONS,
} from '@/entities/puppy'
import { Select } from '@/shared/ui/components'
import { cn } from '@/shared/lib/utils'
import styles from './PuppiesFilters.module.scss'

export interface PuppiesFiltersValue {
  gender: string
  potential: string
  status: string
}

const DEFAULT_FILTERS: PuppiesFiltersValue = {
  gender: 'all',
  potential: 'all',
  status: 'all',
}

interface PuppiesFiltersProps {
  value?: PuppiesFiltersValue
  onChange?: (value: PuppiesFiltersValue) => void
  className?: string
}

const genderOptions = [...PUPPY_GENDER_OPTIONS]
const potentialOptions = [...PUPPY_POTENTIAL_OPTIONS]
const statusOptions = [...PUPPY_STATUS_OPTIONS]

export function PuppiesFilters({
  value = DEFAULT_FILTERS,
  onChange,
  className,
}: PuppiesFiltersProps) {
  const filters = value ?? DEFAULT_FILTERS

  const handleGenderChange = (gender: string) => {
    onChange?.({ ...filters, gender })
  }
  const handlePotentialChange = (potential: string) => {
    onChange?.({ ...filters, potential })
  }
  const handleStatusChange = (status: string) => {
    onChange?.({ ...filters, status })
  }

  return (
    <div className={cn([styles.root, className || ''])}>
      <Select
        label="Пол"
        options={genderOptions}
        value={filters.gender}
        onChange={handleGenderChange}
      />
      <Select
        label="Потенциал"
        options={potentialOptions}
        value={filters.potential}
        onChange={handlePotentialChange}
      />
      <Select
        label="Статус"
        options={statusOptions}
        value={filters.status}
        onChange={handleStatusChange}
      />
    </div>
  )
}
