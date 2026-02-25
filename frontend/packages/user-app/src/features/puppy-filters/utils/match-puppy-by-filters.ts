import type { Puppy } from '@/entities/puppy/model/types';
import { FILTER_VALUE_ALL } from '../config/filter-constants';
import type { PuppyFilters } from '../model/types';

export function matchPuppyByFilters(
  puppy: Puppy,
  filters: PuppyFilters,
): boolean {
  if (filters.sex && filters.sex.value !== FILTER_VALUE_ALL && puppy.sex.code !== filters.sex.value) {
    return false;
  }
  if (filters.potential && filters.potential.value !== FILTER_VALUE_ALL && puppy.potential.code !== filters.potential.value) {
    return false;
  }
  if (filters.status && filters.status.value !== FILTER_VALUE_ALL && puppy.status.code !== filters.status.value) {
    return false;
  }
  return true;
}
