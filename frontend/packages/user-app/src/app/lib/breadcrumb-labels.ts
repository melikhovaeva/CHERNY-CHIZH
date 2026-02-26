import { useGetArticleBySlugQuery } from '@/entities/article';
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
  user: 'Профиль',
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
  const breedSlug =
    (isPuppiesRoute || isDogsRoute) ? segments[1] : undefined;
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

  const { data: breeds } = useGetBreedsQuery(undefined, {
    skip: !shouldLoadBreed,
  });

  const { data: puppy } = useGetPuppyQuery(puppyId as number, {
    skip: !shouldLoadPuppy,
  });

  const { data: article } = useGetArticleBySlugQuery(articleSlug ?? '', {
    skip: !articleSlug,
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
      }

      if (pathname) {
        return segment;
      }

      return segment;
    },
    [breeds, puppy, article],
  );
}
