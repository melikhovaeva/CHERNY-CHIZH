import {
  useGetArticlesListQuery,
  useGetHomeLibraryQuery,
  type ArticleMinimal,
} from '@/entities/article';
import type { Tab } from '@/features/tabs-filter';
import { API_CONFIG } from '@/shared/config/api';
import { cn } from '@/shared/lib/utils';
import { Button, Card, Skeleton } from '@/shared/ui/components';
import { FilterableGallery } from '@/widgets/FilterableGallery';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import styles from './KnowledgeBaseSection.module.scss';

const SKELETON_ITEMS = 6;
const ARTICLES_PER_TAG = 3;

function getImageUrl(imagePreview: string | null): string | undefined {
  if (!imagePreview) return undefined;
  if (imagePreview.startsWith('http')) return imagePreview;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${imagePreview.startsWith('/') ? '' : '/'}${imagePreview}`;
}

export interface KnowledgeBaseSectionItem extends ArticleMinimal {
  _tagId: string;
}

export function KnowledgeBaseSection() {
  const { data: libraryData, isLoading: tagsLoading } = useGetHomeLibraryQuery();
  const navigate = useNavigate();

  const tabs: Tab[] = useMemo(
    () =>
      (libraryData?.tags ?? []).map((tag) => ({
        id: tag.id,
        label: tag.label,
        value: String(tag.id),
      })),
    [libraryData?.tags],
  );

  const [activeTagValue, setActiveTagValue] = useState<string>('');
  const activeTab = activeTagValue || tabs[0]?.value || '';
  const activeTagId = activeTab ? Number(activeTab) : undefined;

  const { data: articlesData, isLoading: articlesLoading } =
    useGetArticlesListQuery(
      { tag: activeTagId!, pageSize: ARTICLES_PER_TAG },
      { skip: activeTagId == null },
    );

  const items: KnowledgeBaseSectionItem[] = useMemo(
    () =>
      (articlesData?.results ?? []).map((article: ArticleMinimal) => ({
        ...article,
        _tagId: activeTab,
      })),
    [articlesData?.results, activeTab],
  );

  const hasContent = tabs.length > 0;

  if (tagsLoading) {
    return (
      <section className={cn([styles.root, 'filled primary'])}>
        <div className={styles.container}>
          <h2 className={styles.title}>База знаний</h2>
          <div className={styles.gallery}>
            <div className={styles.skeletonTabs} />
            <ul className={styles.gallery__list}>
              {Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
                <li key={i} className={styles.gallery__list__item}>
                  <Skeleton width="100%" height={200} />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.buttonContainer}>
            <Button disabled>Смотреть все</Button>
          </div>
        </div>
      </section>
    );
  }

  if (!hasContent) {
    return (
      <section className={cn([styles.root, 'filled primary'])}>
        <div className={styles.container}>
          <h2 className={styles.title}>База знаний</h2>
          <div className={styles.buttonContainer}>
            <Link to="/knowledge-base" className={styles.buttonLink}>
              Смотреть все
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn([styles.root, 'filled primary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>База знаний</h2>
        <FilterableGallery<KnowledgeBaseSectionItem>
          tabs={tabs}
          items={items}
          filterBy="_tagId"
          getFilterValue={(item) => item._tagId}
          getItemKey={(item) => `${item.id}-${item._tagId}`}
          activeTab={activeTab}
          onActiveTabChange={setActiveTagValue}
          isLoading={articlesLoading}
          renderItem={(item) => (
            <Link
              to="/articles/$slug"
              params={{ slug: item.slug }}
              className={styles.cardLink}
            >
              <Card
                imgUrl={getImageUrl(item.imagePreview ?? null) ?? ''}
                title={item.title}
              />
            </Link>
          )}
          className={styles.gallery}
        />
        <div className={styles.buttonContainer}>
          <Button onClick={() => navigate({ to: '/knowledge-base' })}>
            Смотреть все
          </Button>
        </div>
      </div>
    </section>
  );
}
