import type { Puppy } from './types'

export const getPuppyMainPhotoUrl = (puppy: Puppy): string =>
  puppy.photos[0]?.url ?? ''

