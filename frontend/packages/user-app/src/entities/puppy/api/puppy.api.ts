import {
  enhancedApi,
  useV1DogsListQuery,
  useV1DogsRetrieveQuery,
  useV1BreedsDogsListQuery,
} from '@/shared/api/generated/dogs.generated';

export const puppyApi = enhancedApi;

const DEFAULT_PAGE_SIZE = 20;

export interface GetPuppiesQueryArgs {
  page?: number;
  skip?: number;
  pageSize?: number;
}

export interface GetPuppiesByBreedQueryArgs {
  breedSlug: string;
  page?: number;
  skip?: number;
  pageSize?: number;
}

function toLimitOffset(args?: GetPuppiesQueryArgs | GetPuppiesByBreedQueryArgs) {
  const page = args?.page ?? 1;
  const pageSize = args?.pageSize ?? DEFAULT_PAGE_SIZE;
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize + (args?.skip ?? 0),
  };
}

/** Wrapper: app uses page/pageSize; generated uses limit/offset. */
export function useGetPuppiesQuery(
  args?: GetPuppiesQueryArgs | void,
  options?: Parameters<typeof useV1DogsListQuery>[1]
) {
  const { limit, offset } = toLimitOffset(args ?? {});
  return useV1DogsListQuery(
    { ageGroup: 'puppy', limit, offset },
    options
  );
}

/** Wrapper: app passes id; generated expects { id, pk }. */
export function useGetPuppyQuery(
  id: number,
  options?: Parameters<typeof useV1DogsRetrieveQuery>[1]
) {
  return useV1DogsRetrieveQuery({ id, pk: id }, options);
}

/** Wrapper: app uses page/pageSize; generated uses limit/offset. */
export function useGetPuppiesByBreedQuery(
  args: GetPuppiesByBreedQueryArgs,
  options?: Parameters<typeof useV1BreedsDogsListQuery>[1]
) {
  const { limit, offset } = toLimitOffset(args);
  return useV1BreedsDogsListQuery(
    { breedSlug: args.breedSlug, ageGroup: 'puppy', limit, offset },
    options
  );
}
