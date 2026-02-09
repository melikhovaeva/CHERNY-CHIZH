import { useGetBreedsQuery } from '@/entities/breed';
import { useGetPuppyQuery } from '@/entities/puppy';
import { useLocation } from '@tanstack/react-router';
import { useCallback } from 'react';

const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
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
  const breedSlug = isPuppiesRoute ? segments[1] : undefined;
  const puppyId =
    isPuppiesRoute && segments[2] ? Number(segments[2]) : undefined;

  const shouldLoadBreed = Boolean(breedSlug);
  const shouldLoadPuppy = Boolean(puppyId) && !Number.isNaN(puppyId);

  const { data: breeds } = useGetBreedsQuery(undefined, {
    skip: !shouldLoadBreed,
  });

  const { data: puppy } = useGetPuppyQuery(puppyId as number, {
    skip: !shouldLoadPuppy,
  });

  return useCallback(
    (segment: string, pathname?: string) => {
      const staticLabel = SEGMENT_LABELS[segment];
      if (staticLabel) return staticLabel;

      const breedLabel = breeds?.find((b) => b.slug === segment)?.name;
      if (breedLabel) return breedLabel;

      if (pathname) {
        const pathSegments = pathname.split('/').filter(Boolean);
        if (
          pathSegments[0] === 'puppies' &&
          pathSegments[2] &&
          segment === pathSegments[2] &&
          puppy
        ) {
          return puppy.name;
        }
      }

      if (pathname) {
        return segment;
      }

      return segment;
    },
    [breeds, puppy],
  );
}
