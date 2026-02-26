const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  dogs: 'Собаки',
  about: 'О нас',
  contacts: 'Контакты',
  library: 'База знаний',
  articles: 'Статьи',
};

export function getSegmentLabelStatic(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}
