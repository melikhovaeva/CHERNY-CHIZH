export enum BreedAboutBlockKey {
  APPEARANCE = 'appearance',
  CHARACTER = 'character',
  ADAPTABILITY = 'adaptability',
  CARE = 'care',
  ACTIVITY = 'activity',
}

export const CARD_LABELS: Record<BreedAboutBlockKey, string> = {
  [BreedAboutBlockKey.APPEARANCE]: 'Внешность',
  [BreedAboutBlockKey.CHARACTER]: 'Характер',
  [BreedAboutBlockKey.ADAPTABILITY]: 'Адаптивность',
  [BreedAboutBlockKey.CARE]: 'Уход',
  [BreedAboutBlockKey.ACTIVITY]: 'Активность',
};
