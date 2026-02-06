import type { BreedValue } from './types';

export interface BreedOption {
  value: BreedValue;
  label: string;
}

export const BREED_OPTIONS: BreedOption[] = [
  { value: 'sharpey', label: 'Шарпеи' },
  { value: 'sibainu', label: 'Сиба-ину' },
  { value: 'corgi', label: 'Корги' },
  { value: 'spitz', label: 'Шпицы' },
];

export const getBreedImageUrl = (value: string) => `/${value}.webp`;

const BREED_FULL_NAMES: Record<BreedValue, string> = {
  sharpey: 'Китайский шарпей',
  sibainu: 'Сиба-ину',
  corgi: 'Вельш Корги Пемброк',
  spitz: 'Померанский шпиц',
};

export const getBreedFullName = (breedId: BreedValue | undefined): string =>
  breedId ? (BREED_FULL_NAMES[breedId] ?? breedId) : '';
