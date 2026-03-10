import { baseApi as api } from "../base-api";
export const addTagTypes = ["Dictionaries"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      dictionariesList: build.query<
        DictionariesListApiResponse,
        DictionariesListApiArg
      >({
        query: () => ({ url: `/api/v1/dictionaries/` }),
        providesTags: ["Dictionaries"],
      }),
      dictionariesRetrieve: build.query<
        DictionariesRetrieveApiResponse,
        DictionariesRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/dictionaries/${queryArg.id}/` }),
        providesTags: ["Dictionaries"],
      }),
      dictionariesDictionary: build.query<
        DictionariesDictionaryApiResponse,
        DictionariesDictionaryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/dictionaries/${queryArg.id}/${queryArg.dictIdentifier}/`,
        }),
        providesTags: ["Dictionaries"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type DictionariesListApiResponse = /** status 200  */ {
  [key: string]: any;
};
export type DictionariesListApiArg = void;
export type DictionariesRetrieveApiResponse = /** status 200  */ {
  [key: string]: any;
};
export type DictionariesRetrieveApiArg = {
  id: string;
  /** Идентификатор группы: числовой ID или строковый ключ группы (например, `dogs_filters`). */
  pk: string;
};
export type DictionariesDictionaryApiResponse = /** status 200  */ {
  [key: string]: any;
};
export type DictionariesDictionaryApiArg = {
  /** Идентификатор конкретного словаря внутри группы (ID или ключ). */
  dictIdentifier: string;
  id: string;
  /** Идентификатор группы словарей (ID или ключ). */
  pk: string;
};
export const {
  useDictionariesListQuery,
  useDictionariesRetrieveQuery,
  useDictionariesDictionaryQuery,
} = injectedRtkApi;
