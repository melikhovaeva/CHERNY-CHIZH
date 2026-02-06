import type { BreedValue } from '@/entities/breed';

export type PuppyStatusName = 'В продаже' | 'Забронирован' | 'Куплен';

export interface PuppyStatus {
  uid: string;
  name: PuppyStatusName;
}

export type PuppySexName = 'dog' | 'bitch';

export interface PuppySex {
  uid: string;
  name: PuppySexName;
}

export interface PuppyDocument {
  uid: string;
  name: string;
  url: string;
}

export interface PuppyParent {
  uid: string;
  name: string;
  url: string;
}

export interface PuppyPhoto {
  uid: string;
  url: string;
}

export interface Puppy {
  uid: number;
  name: string;
  internationalName: string;
  breed: BreedValue;
  status: PuppyStatus;
  birthDate: Date;
  sex: PuppySex;
  color: string;
  documents: PuppyDocument[];
  parents: PuppyParent[];
  photos: PuppyPhoto[];
  potential?: string;
  description?: string;
}
