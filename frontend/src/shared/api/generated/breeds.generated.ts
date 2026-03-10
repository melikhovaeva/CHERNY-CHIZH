import { baseApi as api } from "../base-api";
export const addTagTypes = ["Breeds"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1BreedsList: build.query<V1BreedsListApiResponse, V1BreedsListApiArg>({
        query: () => ({ url: `/api/v1/breeds/` }),
        providesTags: ["Breeds"],
      }),
      v1BreedsRetrieve: build.query<
        V1BreedsRetrieveApiResponse,
        V1BreedsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/breeds/${queryArg.id}/` }),
        providesTags: ["Breeds"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1BreedsListApiResponse = /** status 200  */ BreedListRead[];
export type V1BreedsListApiArg = void;
export type V1BreedsRetrieveApiResponse = /** status 200  */ BreedListRead;
export type V1BreedsRetrieveApiArg = {
  /** A unique integer value identifying this Порода. */
  id: number;
};
export type BreedList = {
  name: string;
  fullName: string;
};
export type RatingBlock = {
  rating: number;
  text: string;
};
export type BreedDescription = {
  appearance: string;
  character: RatingBlock;
  adaptability: RatingBlock;
  care: RatingBlock;
  activity: RatingBlock;
};
export type BreedListRead = {
  id: number;
  slug: string;
  name: string;
  fullName: string;
  photo: string;
  description: BreedDescription;
  articleSlug: string;
};
export const { useV1BreedsListQuery, useV1BreedsRetrieveQuery } =
  injectedRtkApi;
