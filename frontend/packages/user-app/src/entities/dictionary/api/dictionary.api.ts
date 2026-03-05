import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { DictionaryGroup, DictionaryMeta, DictionariesIndex } from '../model/types';

export const dictionaryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDictionariesIndex: build.query<DictionariesIndex, void>({
      query: () => API_CONFIG.ENDPOINTS.DICTIONARIES,
      providesTags: [{ type: API_CONFIG.TAG_TYPES.DICTIONARIES, id: 'INDEX' }],
    }),
    getDictionaryGroup: build.query<DictionaryGroup, string>({
      query: (groupKey: string) =>
        `${API_CONFIG.ENDPOINTS.DICTIONARIES}${groupKey}/`,
      providesTags: (_result, _error, groupKey) => [
        { type: API_CONFIG.TAG_TYPES.DICTIONARIES, id: `GROUP_${groupKey}` },
      ],
    }),
    getDictionary: build.query<
      DictionaryMeta,
      { groupKey: string; dictKey: string }
    >({
      query: ({ groupKey, dictKey }) =>
        `${API_CONFIG.ENDPOINTS.DICTIONARIES}${groupKey}/${dictKey}/`,
      providesTags: (_result, _error, { groupKey, dictKey }) => [
        {
          type: API_CONFIG.TAG_TYPES.DICTIONARIES,
          id: `DICT_${groupKey}_${dictKey}`,
        },
      ],
    }),
  }),
});

export const {
  useGetDictionariesIndexQuery,
  useGetDictionaryGroupQuery,
  useGetDictionaryQuery,
} = dictionaryApi;
