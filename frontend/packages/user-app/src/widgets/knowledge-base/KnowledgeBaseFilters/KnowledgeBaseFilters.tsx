import type { Tab } from '@/features/tabs-filter';
import { Tabs } from '@/features/tabs-filter';
import { cn } from '@/shared/lib/utils';
import styles from './KnowledgeBaseFilters.module.scss';

export const KNOWLEDGE_BASE_CATEGORY_ALL = 'all';
export const KNOWLEDGE_BASE_CATEGORY_ARTICLES = 'articles';

export const KNOWLEDGE_BASE_TABS: Tab[] = [
  { id: 'all', label: 'Все', value: KNOWLEDGE_BASE_CATEGORY_ALL },
  { id: 'articles', label: 'Статьи', value: KNOWLEDGE_BASE_CATEGORY_ARTICLES },
];

export type KnowledgeBaseCategory = string;

interface KnowledgeBaseFiltersProps {
  activeCategory?: KnowledgeBaseCategory;
  onCategoryChange: (category: KnowledgeBaseCategory) => void;
  className?: string;
}

export function KnowledgeBaseFilters({
  activeCategory = KNOWLEDGE_BASE_CATEGORY_ALL,
  onCategoryChange,
  className,
}: KnowledgeBaseFiltersProps) {
  const activeTab: string =
    typeof activeCategory === 'string' ? activeCategory : 'all';
  return (
    <div className={cn([styles.root, className ?? ''])}>
      <Tabs
        tabs={KNOWLEDGE_BASE_TABS}
        activeTab={activeTab}
        onTabChange={(value: string) => onCategoryChange(value)}
        variant="primary"
        className={styles.tabs}
        buttonClassName={styles.tabs__button}
        buttonActiveClassName={styles.tabs__button__active}
      />
    </div>
  );
}
