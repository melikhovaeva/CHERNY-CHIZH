import { Input } from '@/shared/ui/components';
import { useEffect, useRef, useState } from 'react';
import styles from './KnowledgeBaseSearch.module.scss';
import SearchIcon from './assets/search.svg?react';
const DEBOUNCE_MS = 400;

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
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue((prev) => (value !== prev ? value : prev));
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearchChange(localValue);
      timeoutRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValue, onSearchChange]);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <span className={styles.icon} aria-hidden>
        <SearchIcon width={16} height={16} />
      </span>
      <Input
        type="text"
        value={localValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLocalValue(e.target.value)
        }
        placeholder={placeholder}
        className={styles.input}
        aria-label="Поиск по базе знаний"
      />
    </div>
  );
}
