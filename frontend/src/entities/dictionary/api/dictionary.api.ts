import {
  enhancedApi,
  useDictionariesListQuery,
  useDictionariesRetrieveQuery,
  useDictionariesDictionaryQuery,
} from '@/shared/api/generated/dictionaries.generated';

export const dictionaryApi = enhancedApi;

export const useGetDictionariesIndexQuery = useDictionariesListQuery;

/** Wrapper: app passes groupKey string; generated expects { id, pk }. */
export function useGetDictionaryGroupQuery(
  groupKey: string,
  options?: Parameters<typeof useDictionariesRetrieveQuery>[1]
) {
  return useDictionariesRetrieveQuery(
    { id: groupKey, pk: groupKey },
    options
  );
}

/** Wrapper: app passes { groupKey, dictKey }; generated expects { id, pk, dictIdentifier }. */
export function useGetDictionaryQuery(
  args: { groupKey: string; dictKey: string },
  options?: Parameters<typeof useDictionariesDictionaryQuery>[1]
) {
  return useDictionariesDictionaryQuery(
    {
      id: args.groupKey,
      pk: args.groupKey,
      dictIdentifier: args.dictKey,
    },
    options
  );
}
