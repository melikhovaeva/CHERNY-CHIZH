
import { usePuppyFilterOptions, type PuppyFilters } from '@/features'
import { PUPPY_FILTERS_DEFAULTS } from '@/features/puppy-filters/config/filter-defaults'
import { usePuppyFilterLabels } from '@/features/puppy-filters/config/use-puppy-filter-options'
import { cn } from '@/shared/lib/utils'
import { Select } from '@/shared/ui/components'
import { useMemo } from 'react'
import styles from './PuppiesFilters.module.scss'


interface PuppiesFiltersProps {
  value: PuppyFilters
  onChange: (value: PuppyFilters) => void
  className?: string
}

export function PuppiesFilters({
  value,
  onChange,
  className,
}: PuppiesFiltersProps) {

  const { sexOptions, potentialOptions, statusOptions } = usePuppyFilterOptions()
  const { sex, potential, status } = usePuppyFilterLabels()


  const filters = useMemo(() => {
    const createOptions = (
      currentValue: typeof value.sex,
      defaultOption: typeof PUPPY_FILTERS_DEFAULTS.sex,
      options: typeof sexOptions
    ) => {
      const filteredOptions = options.filter(
        opt => opt.value !== defaultOption.value && opt.value !== currentValue.value
      )

      const result = [defaultOption]

      if (currentValue.value !== defaultOption.value) {
        result.push(currentValue)
      }

      result.push(...filteredOptions)

      return result
    }

    return {
      sex: {
        value: value?.sex.value,
        label: sex,
        options: createOptions(value.sex, PUPPY_FILTERS_DEFAULTS.sex, sexOptions),
      },
      potential: {
        value: value?.potential.value,
        label: potential,
        options: createOptions(value.potential, PUPPY_FILTERS_DEFAULTS.potential, potentialOptions),
      },
      status: {
        value: value?.status.value,
        label: status,
        options: createOptions(value.status, PUPPY_FILTERS_DEFAULTS.status, statusOptions),
      },
    }
  }, [value, sex, potential, status, sexOptions, potentialOptions, statusOptions])

  const filtersEntries = Object.entries(filters)

  const handleFilterChange = (key: keyof PuppyFilters) => (selectedValue: string) => {
    const filterConfig = filters[key]
    const selectedOption = filterConfig.options.find(opt => opt.value === selectedValue)

    if (!selectedOption) {
      return
    }

    const newFilters: PuppyFilters = {
      ...value,
      [key]: { value: selectedOption.value, label: selectedOption.label },
    }
    onChange?.(newFilters)
  }
  return (
    <div className={cn([styles.root, className || ''])}>
      {filtersEntries.map(([key, filterValue]) => (
        <Select
          key={key}
          value={filterValue.value}
          label={filterValue.label}
          options={filterValue.options}
          onChange={handleFilterChange(key as keyof PuppyFilters)}
        />
      ))}
    </div>
  )
}
