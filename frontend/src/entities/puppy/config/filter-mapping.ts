import type { PuppySexName, PuppyStatusName } from '../model/types'
import { PUPPY_POTENTIAL_OPTIONS } from './filter-options'

const GENDER_FILTER_TO_SEX: Record<string, PuppySexName> = {
  male: 'dog',
  female: 'bitch',
}

const STATUS_FILTER_TO_NAME: Record<string, PuppyStatusName> = {
  available: 'В продаже',
  reserved: 'Забронирован',
}

export function getSexNameForFilterValue(value: string): PuppySexName | null {
  if (!value) return null
  return GENDER_FILTER_TO_SEX[value] ?? null
}

export function getPotentialLabelForFilterValue(value: string): string | null {
  const option = PUPPY_POTENTIAL_OPTIONS.find((o) => o.value === value)
  return option?.label ?? null
}

export function getStatusNameForFilterValue(value: string): PuppyStatusName | null {
  if (!value) return null
  return STATUS_FILTER_TO_NAME[value] ?? null
}

export interface PuppyFilters {
  gender?: string
  potential?: string
  status?: string
}

export function matchPuppyByFilters(
  puppy: { sex: { name: PuppySexName }; potential?: string; status: { name: PuppyStatusName } },
  filters: PuppyFilters,
): boolean {
  if (!filters) return true

  if (filters.gender && filters.gender !== 'all') {
    const sexName = getSexNameForFilterValue(filters.gender)
    if (sexName != null && puppy.sex.name !== sexName) return false
  }

  if (filters.potential && filters.potential !== 'all') {
    const label = getPotentialLabelForFilterValue(filters.potential)
    if (label != null && puppy.potential !== label) return false
  }

  if (filters.status && filters.status !== 'all') {
    const statusName = getStatusNameForFilterValue(filters.status)
    if (statusName != null && puppy.status.name !== statusName) return false
  }

  return true
}
