import type { Puppy } from './types';

export const formatPuppyDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export function getFirstPhotoUrl(puppy: Puppy): string | undefined {
  return puppy.photos?.[0]?.url;
}
