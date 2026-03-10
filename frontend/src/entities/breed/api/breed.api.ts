import {
  enhancedApi,
  useV1BreedsListQuery,
} from '@/shared/api/generated/breeds.generated';

export const breedApi = enhancedApi;
export const useGetBreedsQuery = useV1BreedsListQuery;
