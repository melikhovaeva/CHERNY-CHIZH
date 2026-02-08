import {
  PUPPY_GENDER_OPTIONS,
  PUPPY_POTENTIAL_OPTIONS,
  PUPPY_STATUS_OPTIONS,
} from '@/entities/puppy'
import { cn } from '@/shared/lib/utils'
import { Select } from '@/shared/ui/components'
import styles from './PuppiesFilters.module.scss'

export interface PuppiesFiltersValue {
  sex: string
  potential: string
  status: string
}

const DEFAULT_FILTERS: PuppiesFiltersValue = {
  sex: 'all',
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

  const handleSexChange = (sex: string) => {
    onChange?.({ ...filters, sex })
  }


  return (
    <div className={cn([styles.root, className || ''])}>
      <Select
        label="Пол"
        options={genderOptions}
        value={filters.sex}
        onChange={handleSexChange}
      />
      <Select
        label="Потенциал"
        options={potentialOptions}
        value={filters.potential}
        onChange={(potential) => onChange?.({ ...filters, potential })}
      />
      <Select
        label="Статус"
        options={statusOptions}
        value={filters.status}
        onChange={(status) => onChange?.({ ...filters, status })}
      />
    </div>
  )
}
