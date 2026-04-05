import { useGetArticleBySlugQuery } from '@/entities/article';
import { useGetCoursesQuery } from '@/entities/course';
import { useGetBreedsQuery } from '@/entities/breed';
import { useGetPuppyQuery } from '@/entities/puppy';
import { useLocation } from '@tanstack/react-router';
import { useCallback } from 'react';

const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  dogs: 'Собаки',
  about: 'О нас',
  contacts: 'Контакты',
  'knowledge-base': 'База знаний',
  articles: 'Статьи',
  user: 'Личный кабинет',
  cabinet: 'Личный кабинет',
  courses: 'Курсы',
  'my-courses': 'Мои курсы',
  settings: 'Настройки',
  constructor: 'Конструктор',
  preview: 'Предпросмотр',
  new: 'Создание курса',
};

export function getSegmentLabelStatic(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}

export function useSegmentLabel(): (
  segment: string,
  pathname?: string,
) => string {
  const { pathname: currentPathname } = useLocation();
  const segments = currentPathname.split('/').filter(Boolean);

  const isPuppiesRoute = segments[0] === 'puppies';
  const isDogsRoute = segments[0] === 'dogs';
  const breedSlug = isPuppiesRoute || isDogsRoute ? segments[1] : undefined;
  const puppyId =
    (isPuppiesRoute || isDogsRoute) && segments[2]
      ? Number(segments[2])
      : undefined;

  const shouldLoadBreed = Boolean(breedSlug);
  const shouldLoadPuppy = Boolean(puppyId) && !Number.isNaN(puppyId);

  const pathSegmentsForArticle = currentPathname.split('/').filter(Boolean);
  const articleSlug =
    pathSegmentsForArticle[0] === 'articles' && pathSegmentsForArticle[1]
      ? pathSegmentsForArticle[1]
      : undefined;

  const isCabinetCoursesRoute =
    segments[0] === 'cabinet' && segments[1] === 'courses';
  const courseSlugCabinet =
    isCabinetCoursesRoute && segments[2] && segments[2] !== 'new'
      ? segments[2]
      : undefined;

  const isPublicCoursesRoute = segments[0] === 'courses';
  const courseSlugPublic =
    isPublicCoursesRoute && segments[1] ? segments[1] : undefined;

  const shouldLoadCourses = Boolean(courseSlugCabinet) || Boolean(courseSlugPublic);

  const { data: breeds } = useGetBreedsQuery(undefined, {
    skip: !shouldLoadBreed,
  });

  const { data: puppy } = useGetPuppyQuery(puppyId as number, {
    skip: !shouldLoadPuppy,
  });

  const { data: article } = useGetArticleBySlugQuery(articleSlug ?? '', {
    skip: !articleSlug,
  });

  const { data: courses } = useGetCoursesQuery(undefined, {
    skip: !shouldLoadCourses,
  });

  return useCallback(
    (segment: string, pathname?: string) => {
      const staticLabel = SEGMENT_LABELS[segment];
      if (staticLabel) return staticLabel;

      const breedLabel = breeds?.find((b) => b.slug === segment)?.name;
      if (breedLabel) return breedLabel;

      if (pathname) {
        const pathSegments = pathname.split('/').filter(Boolean);

        const isPuppyOrDogSegment =
          (pathSegments[0] === 'puppies' || pathSegments[0] === 'dogs') &&
          pathSegments[2] &&
          segment === pathSegments[2] &&
          puppy;
        if (isPuppyOrDogSegment) {
          return puppy.name;
        }

        const isArticleSlugSegment =
          pathSegments[0] === 'articles' &&
          pathSegments[1] === segment &&
          article;
        if (isArticleSlugSegment) {
          return article.title;
        }

        const isCabinetCoursesSlugSegment =
          pathSegments[0] === 'cabinet' &&
          pathSegments[1] === 'courses' &&
          pathSegments[2] === segment &&
          courses;
        if (isCabinetCoursesSlugSegment) {
          const course = courses.find((c) => c.slug === segment);
          if (course) {
            return course.title;
          }
        }

        const isPublicCoursesSlugSegment =
          pathSegments[0] === 'courses' &&
          pathSegments[1] === segment &&
          courses;
        if (isPublicCoursesSlugSegment) {
          const course = courses.find((c) => c.slug === segment);
          if (course) {
            return course.title;
          }
        }
      }

      if (pathname) {
        return segment;
      }

      return segment;
    },
    [breeds, puppy, article, courses],
  );
}
