import type { SelectOption } from '@/shared/ui/components';

interface PuppyFiltersItem extends SelectOption {
  value: string;
  label: string;
}

export interface PuppyFilters {
  sex: PuppyFiltersItem;
  potential: PuppyFiltersItem;
  status: PuppyFiltersItem;
}

export interface PuppyFiltersOption {
  sex: PuppyFiltersItem[];
  potential: PuppyFiltersItem[];
  status: PuppyFiltersItem[];
}

export interface PuppyFiltersLabels {
  sex: string;
  potential: string;
  status: string;
}
