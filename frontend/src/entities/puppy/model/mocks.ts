import { BREED_OPTIONS, getBreedImageUrl } from '@/entities/breed';
import type {
  Puppy,
  PuppyDocument,
  PuppyParent,
  PuppySex,
  PuppySexName,
  PuppyStatus,
  PuppyStatusName,
} from './types';

const STATUS_NAMES: PuppyStatusName[] = ['В продаже', 'Забронирован', 'Куплен'];
const SEX_NAMES: PuppySexName[] = ['dog', 'bitch'];

const COLORS_BY_BREED: Record<string, string[]> = {
  sharpey: ['палевый', 'рыжий', 'кремовый'],
  sibainu: ['рыжий', 'сезам', 'чёрно-подпалый'],
  corgi: ['рыже-белый', 'триколор'],
  spitz: ['белый', 'рыжий', 'чёрный'],
};

const getStatusByIndex = (index: number): PuppyStatus => {
  const name = STATUS_NAMES[index % STATUS_NAMES.length];
  return {
    uid: `status-${index % STATUS_NAMES.length}`,
    name,
  };
};

const getSexByIndex = (index: number): PuppySex => {
  const name = SEX_NAMES[index % SEX_NAMES.length];
  return {
    uid: `sex-${index % SEX_NAMES.length}`,
    name,
  };
};

const getColorForBreed = (breed: string, index: number): string => {
  const colors = COLORS_BY_BREED[breed] ?? ['разный окрас'];
  return colors[index % colors.length];
};

const POTENTIAL_OPTIONS = ['Шоу', 'Пет', 'Брид'];

const getPotentialByIndex = (index: number): string => {
  return POTENTIAL_OPTIONS[index % POTENTIAL_OPTIONS.length];
};

const createDocuments = (uid: number): PuppyDocument[] => [
  {
    uid: `${uid}-rkc`,
    name: 'РКФ',
    url: `/docs/${uid}/rkc.pdf`,
  },
  {
    uid: `${uid}-fci`,
    name: 'FCI',
    url: `/docs/${uid}/fci.pdf`,
  },
];

const createParents = (uid: number): PuppyParent[] => [
  {
    uid: `${uid}-parent-1`,
    name: `Laif Spring Chevrolet Camarro`,
    url: `/parents/${uid}/father`,
  },
  {
    uid: `${uid}-parent-2`,
    name: `Свежий Ветер Искра Счастья`,
    url: `/parents/${uid}/mother`,
  },
];

const createBirthDate = (index: number): Date => {
  const today = new Date();
  const daysAgo = 60 + index * 5;
  const result = new Date(today);
  result.setDate(today.getDate() - daysAgo);
  return result;
};

export const getPuppiesMock = (): Puppy[] =>
  BREED_OPTIONS.flatMap((breed, bIdx) =>
    Array.from({ length: 3 }, (_, idx) => {
      const uid = bIdx * 3 + idx + 1;
      const flatIndex = bIdx * 3 + idx;

      return {
        uid,
        name: `${breed.label} ${idx + 1}`,
        breed: breed.value,
        status: getStatusByIndex(flatIndex),
        birthDate: createBirthDate(flatIndex),
        sex: getSexByIndex(flatIndex),
        color: getColorForBreed(breed.value, idx),
        documents: createDocuments(uid),
        parents: createParents(uid),
        photos: [
          {
            uid: `${uid}-photo-1`,
            url: getBreedImageUrl(breed.value),
          },
        ],
        potential: getPotentialByIndex(flatIndex),
      };
    }),
  );
