export type {
  BreedListRead as Breed,
  BreedDescription,
  BreedList,
  RatingBlock,
} from '@/shared/api/generated/breeds.generated';

/** Alias for RatingBlock (schema name). */
export type BreedDescriptionBlock = import('@/shared/api/generated/breeds.generated').RatingBlock;

/** Local: not in API schema. */
export type BreedValue = 'sharpey' | 'sibainu' | 'corgi' | 'spitz';
