import {
  enhancedApi,
  useV1DogsListQuery,
  useV1BreedsDogsListQuery,
} from '@/shared/api/generated/dogs.generated';

export const dogApi = enhancedApi;

const DEFAULT_PAGE_SIZE = 20;

export interface GetDogsQueryArgs {
  page?: number;
  skip?: number;
  pageSize?: number;
}

export interface GetDogsByBreedQueryArgs {
  breedSlug: string;
  page?: number;
  skip?: number;
  pageSize?: number;
}

function toLimitOffset(args?: GetDogsQueryArgs | GetDogsByBreedQueryArgs) {
  const page = args?.page ?? 1;
  const pageSize = args?.pageSize ?? DEFAULT_PAGE_SIZE;
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize + (args?.skip ?? 0),
  };
}

/** Wrapper: app uses page/pageSize; generated uses limit/offset. */
export function useGetDogsQuery(
  args?: GetDogsQueryArgs | void,
  options?: Parameters<typeof useV1DogsListQuery>[1]
) {
  const { limit, offset } = toLimitOffset(args ?? {});
  return useV1DogsListQuery(
    { ageGroup: 'adult', limit, offset },
    options
  );
}

/** Wrapper: app uses page/pageSize; generated uses limit/offset. */
export function useGetDogsByBreedQuery(
  args: GetDogsByBreedQueryArgs,
  options?: Parameters<typeof useV1BreedsDogsListQuery>[1]
) {
  const { limit, offset } = toLimitOffset(args);
  return useV1BreedsDogsListQuery(
    { breedSlug: args.breedSlug, ageGroup: 'adult', limit, offset },
    options
  );
}
