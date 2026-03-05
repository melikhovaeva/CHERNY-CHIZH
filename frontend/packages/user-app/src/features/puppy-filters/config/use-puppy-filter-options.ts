import { useGetDictionaryGroupQuery } from '@/entities/dictionary';
import { useMemo } from 'react';
import { DICTIONARY_GROUP_PUPPY, DICTIONARY_KEYS } from './filter-constants';
import {
  PUPPY_FILTERS_DEFAULT_LABELS,
  PUPPY_FILTERS_DEFAULTS,
} from './filter-defaults';

export function usePuppyFilterOptions() {
  const {
    data: puppyDicts,
    isLoading,
    error,
  } = useGetDictionaryGroupQuery(DICTIONARY_GROUP_PUPPY);

  const puppyOptions = useMemo(() => {
    if (!puppyDicts) {
      return {
        sex: [PUPPY_FILTERS_DEFAULTS.sex],
        potential: [PUPPY_FILTERS_DEFAULTS.potential],
        status: [PUPPY_FILTERS_DEFAULTS.status],
      };
    }
    return {
      sex: puppyDicts?.dictionaries[DICTIONARY_KEYS.SEX].items.map((item) => ({
        value: item.code,
        label: item.label,
      })),
      potential: puppyDicts?.dictionaries[DICTIONARY_KEYS.POTENTIAL].items.map(
        (item) => ({
          value: item.code,
          label: item.label,
        }),
      ),
      status: puppyDicts?.dictionaries[DICTIONARY_KEYS.STATUS].items.map(
        (item) => ({
          value: item.code,
          label: item.label,
        }),
      ),
    };
  }, [puppyDicts]);

  const sexOptions = useMemo(() => {
    return puppyOptions.sex;
  }, [puppyOptions]);

  const potentialOptions = useMemo(() => {
    return puppyOptions.potential;
  }, [puppyOptions]);

  const statusOptions = useMemo(() => {
    return puppyOptions.status;
  }, [puppyOptions]);

  return {
    sexOptions,
    potentialOptions,
    statusOptions,
    isLoading,
    error,
  };
}

export const usePuppyFilterLabels = () => {
  const { data: puppyDicts } = useGetDictionaryGroupQuery(
    DICTIONARY_GROUP_PUPPY,
  );

  const labels = useMemo(() => {
    return {
      sex:
        puppyDicts?.dictionaries[DICTIONARY_KEYS.SEX].verboseName ??
        PUPPY_FILTERS_DEFAULT_LABELS.sex,
      potential:
        puppyDicts?.dictionaries[DICTIONARY_KEYS.POTENTIAL].verboseName ??
        PUPPY_FILTERS_DEFAULT_LABELS.potential,
      status:
        puppyDicts?.dictionaries[DICTIONARY_KEYS.STATUS].verboseName ??
        PUPPY_FILTERS_DEFAULT_LABELS.status,
    };
  }, [puppyDicts]);

  return {
    sex: labels.sex,
    potential: labels.potential,
    status: labels.status,
  };
};
