const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
};

export function getSegmentLabelStatic(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}
