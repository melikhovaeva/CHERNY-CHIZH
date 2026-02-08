import type { PuppyStatusName } from '../model/types';
import { PUPPY_POTENTIAL_OPTIONS } from './filter-options';

const STATUS_FILTER_TO_NAME: Record<string, PuppyStatusName> = {
  available: 'В продаже',
  reserved: 'Забронирован',
};

export function getPotentialLabelForFilterValue(value: string): string | null {
  const option = PUPPY_POTENTIAL_OPTIONS.find((o) => o.value === value);
  return option?.label ?? null;
}

export function getStatusNameForFilterValue(
  value: string,
): PuppyStatusName | null {
  if (!value) return null;
  return STATUS_FILTER_TO_NAME[value] ?? null;
}

export interface PuppyFilters {
  sex?: string;
  potential?: string;
  status?: string;
}

export function matchPuppyByFilters(
  puppy: {
    sex: { code: string };
    potential?: string;
    status: { label: string };
  },
  filters: PuppyFilters,
): boolean {
  if (!filters) return true;

  if (filters.sex && filters.sex !== 'all') {
    if (filters.sex !== puppy.sex.code) return false;
  }

  if (filters.status && filters.status !== 'all') {
    const statusLabel = getStatusNameForFilterValue(filters.status);
    if (statusLabel != null && puppy.status.label !== statusLabel) return false;
  }

  return true;
}
