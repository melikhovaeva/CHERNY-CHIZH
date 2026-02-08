import { useGetBreedsQuery } from '@/entities/breed'
import { useGetPuppiesQuery } from '@/entities/puppy'
import { useCallback } from 'react'

const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
}

export function getSegmentLabelStatic(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment
}

export function useSegmentLabel(): (segment: string, pathname?: string) => string {
  const { data: breeds } = useGetBreedsQuery()
  const { data: puppies } = useGetPuppiesQuery()
  return useCallback(
    (segment: string, pathname?: string) => {
      const breedLabel = breeds?.find((b) => b.slug === segment)?.name
      if (breedLabel) return breedLabel
      if (pathname) {
        const segments = pathname.split('/').filter(Boolean)
        if (segments[0] === 'puppies' && segments[2] && segment === segments[2]) {
          const id = Number(segment)
          const puppy = puppies?.find((p) => p.id === id)
          return puppy?.name ?? segment
        }
      }
      return SEGMENT_LABELS[segment] ?? segment
    },
    [breeds, puppies],
  )
}
