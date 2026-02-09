import { FILTER_VALUE_ALL } from './filter-constants';
import type { PuppyFilters, PuppyFiltersLabels } from '../model/types';

export const PUPPY_FILTERS_DEFAULTS: PuppyFilters = {
  sex: { value: FILTER_VALUE_ALL, label: 'Все' },
  potential: { value: FILTER_VALUE_ALL, label: 'Все' },
  status: { value: FILTER_VALUE_ALL, label: 'Все' },
};

export const PUPPY_FILTERS_DEFAULT_LABELS: PuppyFiltersLabels = {
  sex: 'Пол',
  potential: 'Потенциал',
  status: 'Статус',
};
