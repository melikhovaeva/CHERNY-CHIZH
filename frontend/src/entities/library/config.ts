import type { LibraryValue } from './types';

export interface LibraryOption {
  value: LibraryValue;
  label: string;
}

export const LIBRARY_OPTIONS: LibraryOption[] = [
  { value: 'behavior', label: 'Поведение' },
  { value: 'health-n-care', label: 'Здоровье и уход' },
  { value: 'training', label: 'Обучение' },
  { value: 'breed-features', label: 'Породные особенности' },
];

export const getLibraryImageUrl = (value: string) => `/library/${value}.webp`;
