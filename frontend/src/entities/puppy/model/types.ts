import type { Breed } from '@/entities/breed/model/types';

export type PuppyStatusName = 'В продаже' | 'Забронирован' | 'Куплен';

export interface PuppyCharacteristic {
  id: number;
  code: string;
  label: string;
}

export interface PuppyDocument {
  id: string;
  name: string;
  url: string;
}

export interface PuppyParent {
  id: string;
  name: string;
  url: string;
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
  birthDate: string;
  sex: PuppyCharacteristic;
  color: string;
  documents?: PuppyDocument[];
  parents?: PuppyParent[];
  photos?: PuppyPhoto[];
  potential?: PuppyCharacteristic;
  description?: string;
}
