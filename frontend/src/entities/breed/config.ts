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
