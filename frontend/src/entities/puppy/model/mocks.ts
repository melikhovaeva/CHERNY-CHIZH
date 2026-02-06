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

const createDocuments = (uid: number): PuppyDocument[] => [
  {
    uid: `${uid}-pedigree`,
    name: 'Родословная РКФ',
    url: `/docs/${uid}/pedigree.pdf`,
  },
  {
    uid: `${uid}-vet-passport`,
    name: 'Ветеринарный паспорт',
    url: `/docs/${uid}/vet-passport.pdf`,
  },
];

const createParents = (uid: number, breedLabel: string): PuppyParent[] => [
  {
    uid: `${uid}-parents`,
    name: `Родители (${breedLabel})`,
    url: `/parents/${uid}`,
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
        image: getBreedImageUrl(breed.value),
        breed: breed.value,
        status: getStatusByIndex(flatIndex),
        birthDate: createBirthDate(flatIndex),
        sex: getSexByIndex(flatIndex),
        color: getColorForBreed(breed.value, idx),
        documents: createDocuments(uid),
        parents: createParents(uid, breed.label),
      };
    }),
  );
