export type EntityType = 'course' | 'article';

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  course: 'Курс',
  article: 'Статья',
} as const;

export function getEntityDisplayTitle(title: string, entityType: EntityType): string {
  return title?.trim() ? title : ENTITY_TYPE_LABELS[entityType];
}
