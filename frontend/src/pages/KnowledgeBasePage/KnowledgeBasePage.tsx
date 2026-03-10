import {
  KNOWLEDGE_BASE_CATEGORY_ALL,
  KnowledgeBaseFilters,
  KnowledgeBaseList,
  KnowledgeBaseSearch,
  type KnowledgeBaseCategory,
} from '@/widgets';
import { useState } from 'react';
import styles from './KnowledgeBasePage.module.scss';

const TAGLINE =
  'Здесь вы найдете подборки полезных ресурсов, а также фирменные курсы';

export const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<KnowledgeBaseCategory>(
    KNOWLEDGE_BASE_CATEGORY_ALL,
  );

  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>БАЗА ЗНАНИЙ</h2>
          <p className={styles.tagline}>{TAGLINE}</p>
        </div>

        <div className={styles.searchWrap}>
          <KnowledgeBaseSearch
            value={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Поиск"
            className={styles.search}
          />
        </div>

        <div className={styles.filtersWrap}>
          <KnowledgeBaseFilters
            activeCategory={category}
            onCategoryChange={setCategory}
          />
        </div>

        <div className={styles.listWrap}>
          <KnowledgeBaseList search={searchQuery} category={category} />
        </div>
      </section>
    </div>
  );
};
