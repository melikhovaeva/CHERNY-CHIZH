export type {
  DogListRead as Puppy,
  DogByBreedListRead,
  BreedBriefRead,
  CodeLabel,
  DogPhotosRead,
  DogDocumentsRead,
  PaginatedDogListListRead,
  PaginatedDogByBreedListListRead,
  AgeGroupEnum,
} from '@/shared/api/generated/dogs.generated';

/** Local: not in API schema. */
export type PuppyStatusName = 'В продаже' | 'Забронирован' | 'Куплен';

/** Alias for schema CodeLabel (code/label). */
export type PuppyCharacteristic = import('@/shared/api/generated/dogs.generated').CodeLabel;

/** Alias for schema type. */
export type PuppyDocument = import('@/shared/api/generated/dogs.generated').DogDocumentsRead;

/** Parent shape from schema (parents.mother / parents.father). */
export interface PuppyParent {
  id?: string;
  name?: string;
}

export interface PuppyParents {
  mother?: PuppyParent;
  father?: PuppyParent;
}

/** Alias for schema type. */
export type PuppyPhoto = import('@/shared/api/generated/dogs.generated').DogPhotosRead;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
