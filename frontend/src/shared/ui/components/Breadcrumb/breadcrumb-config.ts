import { BREED_OPTIONS } from '@/entities/breed';

const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
};

const BREED_LABELS = Object.fromEntries(
  BREED_OPTIONS.map((opt) => [opt.value, opt.label]),
);

export function getSegmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? BREED_LABELS[segment] ?? segment;
}
