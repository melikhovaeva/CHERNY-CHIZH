import type { LibraryValue } from './types'

import breedFeaturesUrl from './assets/breed-features.webp'
import behaviorUrl from './assets/behavior.webp'
import healthNCareUrl from './assets/health-n-care.webp'
import trainingUrl from './assets/training.webp'

export interface LibraryOption {
  value: LibraryValue
  label: string
}

export const LIBRARY_OPTIONS: LibraryOption[] = [
  { value: 'behavior', label: 'Поведение' },
  { value: 'health-n-care', label: 'Здоровье и уход' },
  { value: 'training', label: 'Обучение' },
  { value: 'breed-features', label: 'Породные особенности' },
]

const LIBRARY_IMAGE_URLS: Record<LibraryValue, string> = {
  behavior: behaviorUrl,
  'health-n-care': healthNCareUrl,
  training: trainingUrl,
  'breed-features': breedFeaturesUrl,
}

export const getLibraryImageUrl = (value: string): string =>
  LIBRARY_IMAGE_URLS[value as LibraryValue] ?? ''
