import { BREED_OPTIONS, getBreedImageUrl } from '@/entities/breed';
import { PUPPY_POTENTIAL_OPTIONS } from '../config/filter-options';
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

const POTENTIAL_LABELS = PUPPY_POTENTIAL_OPTIONS.filter(
  (o) => o.value !== 'all',
).map((o) => o.label);

const getPotentialByIndex = (index: number): string => {
  return POTENTIAL_LABELS[index % POTENTIAL_LABELS.length];
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
        internationalName: `${breed.value.charAt(0).toUpperCase() + breed.value.slice(1)} ${idx + 1}`,
        breed: breed.value,
        status: getStatusByIndex(0),
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
        description:
          'Щенок от титулованных родителей, привит по возрасту, с клеймом и ветеринарным паспортом. Документы РКФ FCI. Возможна установка микрочипа.',
      };
    }),
  );

export const getPuppyById = (uid: number): Puppy | undefined =>
  getPuppiesMock().find((p) => p.uid === uid);

export const PUPPIES_FAQ_ITEMS = [
  {
    id: 'delivery-moscow',
    title: 'Доставка по Москве',
    content:
      'Наш питомник располагается в ближнем Подмосковье и мы понимаем, что не у всех есть возможность и время приехать к нам. Мы готовы привезти Вам выбранного на сайте щенка к вам домой, при условии предварительного внесения небольшого депозита',
  },
  {
    id: 'delivery-russia',
    title: 'Доставка по России',
    content:
      'Мы готовы привезти Вам выбранного на сайте щенка к вам домой, при условии предварительного внесения небольшого депозита',
  },
  {
    id: 'delivery-abroad',
    title: 'Доставка за границу',
    content:
      'Мы готовы привезти Вам выбранного на сайте щенка к вам домой, при условии предварительного внесения небольшого депозита',
  },
];
