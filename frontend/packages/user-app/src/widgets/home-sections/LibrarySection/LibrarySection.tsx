import {
  useGetHomeLibraryQuery,
  type ArticleMinimal,
} from '@/entities/article';
import type { Tab } from '@/features/tabs-filter';
import { API_CONFIG } from '@/shared/config/api';
import { cn } from '@/shared/lib/utils';
import { Button, Card, Skeleton } from '@/shared/ui/components';
import { FilterableGallery } from '@/widgets';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import styles from './LibrarySection.module.scss';

const SKELETON_ITEMS = 6;

function getImageUrl(imagePreview: string | null): string | undefined {
  if (!imagePreview) return undefined;
  if (imagePreview.startsWith('http')) return imagePreview;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${imagePreview.startsWith('/') ? '' : '/'}${imagePreview}`;
}

export interface LibrarySectionItem extends ArticleMinimal {
  _tagId: string;
}

export function LibrarySection() {
  const { data, isLoading } = useGetHomeLibraryQuery();

  const tabs: Tab[] = useMemo(
    () =>
      (data?.tags ?? []).map((tag) => ({
        id: tag.id,
        label: tag.label,
        value: String(tag.id),
      })),
    [data?.tags],
  );

  const items: LibrarySectionItem[] = useMemo(
    () =>
      (data?.groups ?? []).flatMap((group) =>
        group.articles.map((article) => ({
          ...article,
          _tagId: String(group.tagId),
        })),
      ),
    [data?.groups],
  );

  const hasContent = tabs.length > 0 && items.length > 0;

  if (isLoading) {
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
            <Link to="/library" className={styles.buttonLink}>
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
        <FilterableGallery<LibrarySectionItem>
          tabs={tabs}
          items={items}
          filterBy="_tagId"
          getFilterValue={(item) => item._tagId}
          getItemKey={(item) => `${item.id}-${item._tagId}`}
          renderItem={(item) => (
            <Link to={`/articles/${item.slug}`} className={styles.cardLink}>
              <Card
                imgUrl={getImageUrl(item.imagePreview) ?? ''}
                title={item.title}
              />
            </Link>
          )}
          className={styles.gallery}
        />
        <div className={styles.buttonContainer}>
          <Link to="/library" className={styles.buttonLink}>
            Смотреть все
          </Link>
        </div>
      </div>
    </section>
  );
}
