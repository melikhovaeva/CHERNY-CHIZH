import {
  useGetArticlesListQuery,
  type ArticleListItem,
} from '@/entities/article';
import type { CourseRead, CourseEnrollmentRead } from '@/entities/course';
import { isCourseAccessible, useGetCoursesQuery, useGetMyCoursesQuery } from '@/entities/course';
import { Skeleton } from '@/shared/ui/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArticleCard } from '../ArticleCard';
import { CourseCard } from '../CourseCard';
import {
  KNOWLEDGE_BASE_CATEGORY_ARTICLES,
  KNOWLEDGE_BASE_CATEGORY_COURSES,
} from '../KnowledgeBaseFilters';
import styles from './KnowledgeBaseList.module.scss';

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;

type KnowledgeBaseItem =
  | { type: 'course'; data: CourseRead }
  | { type: 'article'; data: ArticleListItem };

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
  const [articleItems, setArticleItems] = useState<ArticleListItem[]>([]);

  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const filterJustResetRef = useRef(false);

  const isArticlesOnly = category === KNOWLEDGE_BASE_CATEGORY_ARTICLES;
  const isCoursesOnly = category === KNOWLEDGE_BASE_CATEGORY_COURSES;
  const isAll = !category || category === 'all';

  const { data: articlesData, isLoading: articlesLoading, isFetching: articlesFetching } = useGetArticlesListQuery(
    isCoursesOnly
      ? undefined
      : {
          page,
          pageSize: PAGE_SIZE,
          search: search.trim() || undefined,
        },
    { skip: isCoursesOnly },
  );

  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery(
    undefined,
    {
      skip: isArticlesOnly,
    },
  );

  const { data: myCourses } = useGetMyCoursesQuery();

  const courses = coursesData ?? [];
  const articlesResponse = articlesData;

  useEffect(() => {
    filterJustResetRef.current = true;
    setPage(1);
    setArticleItems([]);
  }, [search, category]);

  useEffect(() => {
    if (!articlesResponse?.results) return;

    if (filterJustResetRef.current || page === 1) {
      filterJustResetRef.current = false;
      setArticleItems(articlesResponse.results);
    } else {
      setArticleItems((prev) => {
        const existingIds = new Set(prev.map((a: ArticleListItem) => a.id));
        const nextItems = articlesResponse.results.filter(
          (a: ArticleListItem) => !existingIds.has(a.id),
        );
        return [...prev, ...nextItems];
      });
    }
  }, [articlesResponse, page, search, category]);

  const hasMore = useMemo(() => {
    if (!articlesResponse) return false;
    if (articlesResponse.next) return true;
    return (
      articlesResponse.results.length > 0 &&
      articlesResponse.count > articleItems.length
    );
  }, [articlesResponse, articleItems.length]);

  hasMoreRef.current = hasMore;
  isFetchingRef.current = articlesFetching;

  useEffect(() => {
    if (!articlesFetching) {
      isLoadingMoreRef.current = false;
    }
  }, [articlesFetching]);

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

  const mergedItems: KnowledgeBaseItem[] = useMemo(() => {
    if (isCoursesOnly) {
      return courses.map((c) => ({ type: 'course' as const, data: c }));
    }
    if (isArticlesOnly) {
      return articleItems.map((a) => ({ type: 'article' as const, data: a }));
    }
    const courseItems: KnowledgeBaseItem[] = courses.map((c) => ({
      type: 'course' as const,
      data: c,
    }));
    const articleItemsMapped: KnowledgeBaseItem[] = articleItems.map((a) => ({
      type: 'article' as const,
      data: a,
    }));
    return [...courseItems, ...articleItemsMapped];
  }, [isCoursesOnly, isArticlesOnly, courses, articleItems]);

  const isLoading =
    (isAll && (articlesLoading || coursesLoading)) ||
    (isArticlesOnly && articlesLoading) ||
    (isCoursesOnly && coursesLoading);
  const isFetching = articlesFetching;
  const showEmpty = !isLoading && !isFetching && mergedItems.length === 0;

  if (showEmpty) {
    return (
      <div className={className}>
        <p className={styles.empty}>Ничего не найдено</p>
      </div>
    );
  }

  if (isLoading && mergedItems.length === 0) {
    if (isCoursesOnly) {
      return (
        <div className={className}>
          <div className={styles.grid}>
            {[1, 2].map((i) => (
              <div key={i} className={styles.skeletonCourseRow}>
                <Skeleton
                  width="40%"
                  height={200}
                  className={styles.skeletonCourseImage}
                />
                <div className={styles.skeletonCoursePanel}>
                  <Skeleton width="70%" height={24} />
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="90%" height={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className={className}>
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton
                width="100%"
                height={180}
                className={styles.skeletonImage}
              />
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

  return (
    <div className={className}>
      <div className={styles.grid}>
        {mergedItems.map((item) =>
          item.type === 'course' ? (
            <div key={`course-${item.data.id}`} className={styles.courseCardFullRow}>
              <CourseCard
                course={item.data}
                variant="horizontal"
                isAccessible={isCourseAccessible({
                  slug: item.data.slug,
                  enrollments: (myCourses as CourseEnrollmentRead[] | undefined) ?? undefined,
                  isAdmin: false,
                })}
              />
            </div>
          ) : (
            <ArticleCard key={`article-${item.data.id}`} article={item.data} />
          ),
        )}
        {(isArticlesOnly || isAll) && isFetching && (
          <div className={styles.skeletonCard}>
            <Skeleton
              width="100%"
              height={180}
              className={styles.skeletonImage}
            />
            <div className={styles.skeletonContent}>
              <Skeleton width="90%" height={22} />
              <Skeleton width="100%" height={16} />
            </div>
          </div>
        )}
        {(isArticlesOnly || isAll) && hasMore && (
          <div ref={sentinelRef} className={styles.sentinel} />
        )}
      </div>
    </div>
  );
}
