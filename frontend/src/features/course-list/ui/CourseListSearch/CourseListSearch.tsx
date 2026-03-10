import { cn } from '@/shared/lib/utils';
import { SearchInput } from '@/shared/ui';

interface CourseListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CourseListSearch({
  value,
  onChange,
  placeholder = 'Поиск',
  className,
}: CourseListSearchProps) {
  return (
    <SearchInput
      value={value}
      onSearchChange={onChange}
      placeholder={placeholder}
      className={cn([className || ''])}
      ariaLabel="Поиск по курсам"
    />
  );
}
