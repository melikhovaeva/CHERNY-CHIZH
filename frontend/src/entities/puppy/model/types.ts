import type { Breed } from '@/entities/breed/model/types';

export type PuppyStatusName = 'В продаже' | 'Забронирован' | 'Куплен';

export interface PuppyCharacteristic {
  id?: number;
  code: string;
  label: string;
}

export interface PuppyDocument {
  id: string;
  name: string;
}

export interface PuppyParent {
  id: string;
  name: string;
}

export interface PuppyParents {
  mother: PuppyParent;
  father: PuppyParent;
}

export interface PuppyPhoto {
  id: string;
  url: string;
}

export interface Puppy {
  id: number;
  name: string;
  internationalName?: string;
  breed: Breed;
  status: PuppyCharacteristic;
  potential: PuppyCharacteristic;
  sex: PuppyCharacteristic;
  birthDate: string;
  color: string;
  ageGroup?: 'puppy' | 'adult';
  documents?: PuppyDocument[];
  parents?: PuppyParents;
  photos?: PuppyPhoto[];
  description?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
