export type BreedValue = 'sharpey' | 'sibainu' | 'corgi' | 'spitz'

export interface BreedDescriptionBlock {
  rating?: number
  text: string
}

export interface BreedDescription {
  appearance: string
  character: BreedDescriptionBlock
  adaptability: BreedDescriptionBlock
  care: BreedDescriptionBlock
  activity: BreedDescriptionBlock
}
