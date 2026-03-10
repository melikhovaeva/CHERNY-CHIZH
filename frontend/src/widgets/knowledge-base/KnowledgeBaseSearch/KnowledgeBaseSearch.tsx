import { SearchInput } from '@/shared/ui/';

interface KnowledgeBaseSearchProps {
  value?: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function KnowledgeBaseSearch({
  value = '',
  onSearchChange,
  placeholder = 'Поиск',
  className,
}: KnowledgeBaseSearchProps) {
  return (
    <SearchInput
      value={value}
      onSearchChange={onSearchChange}
      placeholder={placeholder}
      className={className}
      ariaLabel="Поиск по базе знаний"
    />
  );
}
