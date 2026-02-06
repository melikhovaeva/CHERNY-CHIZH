export const PUPPY_GENDER_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'male', label: 'Мальчик' },
  { value: 'female', label: 'Девочка' },
] as const;

export const PUPPY_POTENTIAL_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'show', label: 'Шоу' },
  { value: 'breed', label: 'Разведение' },
  { value: 'pet', label: 'Домашний питомец' },
] as const;

export const PUPPY_STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'available', label: 'Доступен' },
  { value: 'reserved', label: 'Зарезервирован' },
] as const;
