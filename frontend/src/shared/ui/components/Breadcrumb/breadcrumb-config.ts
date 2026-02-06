import { BREED_OPTIONS } from '@/entities/breed';
import { getPuppyById } from '@/entities/puppy';

const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
};

const BREED_LABELS = Object.fromEntries(
  BREED_OPTIONS.map((opt) => [opt.value, opt.label]),
);

export function getSegmentLabel(segment: string, pathname?: string): string {
  if (pathname) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'puppies' && segments[2] && segment === segments[2]) {
      const puppy = getPuppyById(Number(segment));
      return puppy?.name ?? segment;
    }
  }
  return SEGMENT_LABELS[segment] ?? BREED_LABELS[segment] ?? segment;
}
