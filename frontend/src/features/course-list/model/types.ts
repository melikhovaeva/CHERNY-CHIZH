import type { CourseRead } from '@/entities/course';

export interface CourseListFilterOption {
  id: string;
  label: string;
  value: string;
}

export interface CourseListTemplateProps<TItem> {
  items: TItem[];
  mapToCourse: (item: TItem) => CourseRead;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  filterValue?: string | null;
  onGoToCreateCourse?: () => void;
  onFilterChange?: (value: string | null) => void;
  filterOptions?: CourseListFilterOption[];
  searchPlaceholder?: string;
  className?: string;
}
