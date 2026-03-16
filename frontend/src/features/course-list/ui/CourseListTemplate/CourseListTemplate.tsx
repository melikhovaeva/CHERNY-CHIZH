import { isCourseAccessible, type CourseRead, type CourseEnrollmentRead, useGetMyCoursesQuery } from '@/entities/course';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { Button } from '@/shared';
import { cn } from '@/shared/lib/utils';
import { EditIcon } from '@/shared/ui/assets';
import { CourseCard } from '@/widgets/knowledge-base/CourseCard/CourseCard';
import { useMemo, useState } from 'react';
import {
  COURSE_LIST_LABELS,
  type CourseListFilterOption,
  type CourseListTemplateProps,
} from '../../model';
import { CourseListSearch } from '../CourseListSearch';
import styles from './CourseListTemplate.module.scss';

function mapFilterOptionsToTabs(options: CourseListFilterOption[]): Tab[] {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    value: option.value,
  }));
}

function matchesSearch(course: CourseRead, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();

  const pieces: string[] = [];
  if (course.title) pieces.push(course.title);
  if (course.description) pieces.push(course.description);
  if (course.status?.label) pieces.push(course.status.label);
  if (course.tags?.length) {
    pieces.push(...course.tags.map((t) => t.label));
  }

  return pieces.some((piece) => piece.toLowerCase().includes(q));
}

function matchesFilter(
  course: CourseRead,
  filterValue: string | null,
): boolean {
  if (!filterValue) return true;

  if (
    course.status?.code === filterValue ||
    course.status?.label === filterValue
  ) {
    return true;
  }

  if (course.tags?.some((tag) => tag.label === filterValue)) {
    return true;
  }

  return false;
}

export function CourseListTemplate<TItem>({
  items,
  mapToCourse,
  isLoading = false,
  emptyState,
  filterOptions,
  filterValue = null,
  onGoToCreateCourse,
  onEditCourse,
  onFilterChange,
  searchPlaceholder = 'Поиск',
  className,
}: CourseListTemplateProps<TItem>) {
  const { data: myCourses } = useGetMyCoursesQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const hasFilters =
    !!filterOptions &&
    filterOptions.length > 0 &&
    typeof onFilterChange === 'function';

  const courses: CourseRead[] = useMemo(
    () => items.map(mapToCourse),
    [items, mapToCourse],
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          matchesSearch(course, searchQuery) &&
          matchesFilter(course, hasFilters ? filterValue : null),
      ),
    [courses, searchQuery, filterValue, hasFilters],
  );

  const showEmptyState = !isLoading && filteredCourses.length === 0;

  const contentEmpty = emptyState;

  const controls = (
    <div className={styles.controls}>
      <div className={styles.searchRow}>
        <CourseListSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />
      </div>

      {hasFilters && (
        <div className={styles.filtersRow}>
          <Tabs
            tabs={mapFilterOptionsToTabs(filterOptions)}
            activeTab={filterValue ?? filterOptions[0]?.value ?? ''}
            onTabChange={(value) => onFilterChange(value)}
            variant="primary"
          />
        </div>
      )}
      {onGoToCreateCourse && (
        <Button
          className={styles.createCourseButton}
          variant="crm"
          onClick={onGoToCreateCourse}
        >
          Создать курс
        </Button>
      )}
    </div>
  );

  if (isLoading && courses.length === 0) {
    return (
      <div className={styles.root}>
        {controls}
        <div className={styles.empty}>Загружаем ваши курсы…</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {controls}

      {showEmptyState ? (
        contentEmpty
      ) : (
        <div className={cn([styles.list, className || ''])}>
          {filteredCourses.map((course) => {
            const isAccessible = isCourseAccessible({
              slug: course.slug,
              enrollments: (myCourses as CourseEnrollmentRead[] | undefined) ?? undefined,
              isAdmin: false,
            });

            return onEditCourse ? (
              <div key={course.id} className={styles.cardWrapper}>
                <CourseCard
                  course={course}
                  variant="vertical"
                  isAccessible={isAccessible}
                />
                <Button
                  type="button"
                  variant="crm"
                  className={styles.editCourseButton}
                  onClick={() => onEditCourse(course)}
                  aria-label={COURSE_LIST_LABELS.EDIT_COURSE}
                >
                  <EditIcon aria-hidden />
                </Button>
              </div>
            ) : (
              <CourseCard
                key={course.id}
                course={course}
                variant="vertical"
                isAccessible={isAccessible}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
