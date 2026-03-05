import {
  useGetArticlesListQuery,
  type ArticleListItem,
} from '@/entities/article';
import { Skeleton } from '@/shared/ui/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArticleCard } from '../ArticleCard';
import styles from './KnowledgeBaseList.module.scss';

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;

interface KnowledgeBaseListProps {
  search?: string;
  category?: string;
  className?: string;
}

export function KnowledgeBaseList({
  search = '',
  category,
  className,
}: KnowledgeBaseListProps) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ArticleListItem[]>([]);

  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const filterJustResetRef = useRef(false);

  const { data, isLoading, isFetching, isError } = useGetArticlesListQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    contentType: category,
  });

  useEffect(() => {
    filterJustResetRef.current = true;
    setPage(1);
    setItems([]);
  }, [search, category]);

  // При смене search/category список обнуляется выше; здесь снова заполняем из data.
  // В deps — search и category, т.к. при смене категории page и data могут не измениться (page уже 1, тот же кэш).
  useEffect(() => {
    if (!data?.results) return;

    if (filterJustResetRef.current || page === 1) {
      filterJustResetRef.current = false;
      setItems(data.results);
    } else {
      setItems((prev) => {
        const existingIds = new Set(prev.map((a: ArticleListItem) => a.id));
        const nextItems = data.results.filter((a: ArticleListItem) => !existingIds.has(a.id));
        return [...prev, ...nextItems];
      });
    }
  }, [data, page, search, category]);

  const hasMore = useMemo(() => {
    if (!data) return false;
    if (data.next) return true;
    return data.results.length > 0 && data.count > items.length;
  }, [data, items.length]);

  hasMoreRef.current = hasMore;
  isFetchingRef.current = isFetching;

  useEffect(() => {
    if (!isFetching) {
      isLoadingMoreRef.current = false;
    }
  }, [isFetching]);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current &&
          !isLoadingMoreRef.current
        ) {
          isLoadingMoreRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px 0px' },
    );

    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  // For now only articles; courses tab could show empty or same list later
  const showEmpty = !isLoading && !isFetching && (isError || items.length === 0);

  if (isLoading && items.length === 0) {
    return (
      <div className={className}>
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton width="100%" height={180} className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <Skeleton width="90%" height={22} />
                <Skeleton width="100%" height={16} />
                <Skeleton width="60%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showEmpty) {
    return (
      <div className={className}>
        <p className={styles.empty}>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.grid}>
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {isFetching && (
          <div className={styles.skeletonCard}>
            <Skeleton width="100%" height={180} className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <Skeleton width="90%" height={22} />
              <Skeleton width="100%" height={16} />
            </div>
          </div>
        )}
        {hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
      </div>
    </div>
  );
}
