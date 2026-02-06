import type { BreedValue } from './types'

import corgiUrl from './assets/corgi.webp'
import sharpeyUrl from './assets/sharpey.webp'
import sibainuUrl from './assets/sibainu.webp'
import spitzUrl from './assets/spitz.webp'

export interface BreedOption {
  value: BreedValue
  label: string
}

export const BREED_OPTIONS: BreedOption[] = [
  { value: 'sharpey', label: 'Шарпеи' },
  { value: 'sibainu', label: 'Сиба-ину' },
  { value: 'corgi', label: 'Корги' },
  { value: 'spitz', label: 'Шпицы' },
]

const BREED_IMAGE_URLS: Record<BreedValue, string> = {
  sharpey: sharpeyUrl,
  sibainu: sibainuUrl,
  corgi: corgiUrl,
  spitz: spitzUrl,
}

export const getBreedImageUrl = (value: string): string =>
  BREED_IMAGE_URLS[value as BreedValue] ?? ''

const BREED_FULL_NAMES: Record<BreedValue, string> = {
  sharpey: 'Китайский шарпей',
  sibainu: 'Сиба-ину',
  corgi: 'Вельш Корги Пемброк',
  spitz: 'Померанский шпиц',
};

export const getBreedFullName = (breedId: BreedValue | undefined): string =>
  breedId ? (BREED_FULL_NAMES[breedId] ?? breedId) : '';
