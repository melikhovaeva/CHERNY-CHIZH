import { LIBRARY_OPTIONS, getLibraryImageUrl } from './config';
import type { LibraryValue } from './types';

export interface LibraryItemMock extends Record<string, unknown> {
  id: number;
  name: string;
  image: string;
  library: LibraryValue;
}

export const getLibraryItemsMock = (): LibraryItemMock[] =>
  LIBRARY_OPTIONS.flatMap((library, lIdx) =>
    Array.from({ length: 3 }, (_, idx) => ({
      id: lIdx * 3 + idx + 1,
      name: `Урок ${idx + 1}`,
      image: getLibraryImageUrl(library.value),
      library: library.value,
    })),
  );
