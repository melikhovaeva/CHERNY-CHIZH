const SEGMENT_LABELS: Record<string, string> = {
  puppies: 'Щенки',
  dogs: 'Собаки',
  about: 'О нас',
  contacts: 'Контакты',
  'knowledge-base': 'База знаний',
  articles: 'Статьи',
  cabinet: 'Личный кабинет',
};

export function getSegmentLabelStatic(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}
