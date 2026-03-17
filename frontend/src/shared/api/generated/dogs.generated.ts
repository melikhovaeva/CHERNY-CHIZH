import { baseApi as api } from "../base-api";
export const addTagTypes = ["Dogs"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1BreedsDogsList: build.query<
        V1BreedsDogsListApiResponse,
        V1BreedsDogsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/breeds/${queryArg.breedSlug}/dogs/`,
          params: {
            age_group: queryArg.ageGroup,
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Dogs"],
      }),
      v1BreedsDogsRetrieve: build.query<
        V1BreedsDogsRetrieveApiResponse,
        V1BreedsDogsRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/breeds/${queryArg.breedSlug}/dogs/${queryArg.id}/`,
        }),
        providesTags: ["Dogs"],
      }),
      v1DogsList: build.query<V1DogsListApiResponse, V1DogsListApiArg>({
        query: (queryArg) => ({
          url: `/api/v1/dogs/`,
          params: {
            age_group: queryArg.ageGroup,
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Dogs"],
      }),
      v1DogsRetrieve: build.query<
        V1DogsRetrieveApiResponse,
        V1DogsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/dogs/${queryArg.id}/` }),
        providesTags: ["Dogs"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1BreedsDogsListApiResponse =
  /** status 200  */ PaginatedDogByBreedListListRead;
export type V1BreedsDogsListApiArg = {
  /** Возрастная группа собаки. Допустимые значения: `${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые). */
  ageGroup?: string;
  /** Slug породы (например, `shpits`). */
  breedSlug: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1BreedsDogsRetrieveApiResponse =
  /** status 200  */ DogByBreedListRead;
export type V1BreedsDogsRetrieveApiArg = {
  breedSlug: string;
  id: string;
  /** ID собаки. */
  pk: number;
};
export type V1DogsListApiResponse = /** status 200  */ PaginatedDogListListRead;
export type V1DogsListApiArg = {
  /** Возрастная группа собаки. Допустимые значения: `${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые). */
  ageGroup?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1DogsRetrieveApiResponse = /** status 200  */ DogListRead;
export type V1DogsRetrieveApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  /** ID собаки. */
  pk: number;
};
export type AgeGroupEnum = "puppy" | "adult";
export type DogByBreedList = {
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
  ageGroup?: AgeGroupEnum;
};
export type BreedBrief = {
  name: string;
  fullName: string;
};
export type BreedBriefRead = {
  slug: string;
  name: string;
  fullName: string;
  photo: string;
};
export type CodeLabel = {
  code: string;
  label: string;
};
export type DogPhotos = {
  url: string;
};
export type DogPhotosRead = {
  id: number;
  url: string;
};
export type DogDocuments = {
  name: string;
};
export type DogDocumentsRead = {
  id: number;
  name: string;
};
export type DogByBreedListRead = {
  id: number;
  breed: BreedBriefRead;
  status: CodeLabel;
  sex: CodeLabel;
  potential: CodeLabel;
  photos: DogPhotosRead[];
  documents: DogDocumentsRead[];
  createdAt: string;
  updatedAt: string;
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
  ageGroup?: AgeGroupEnum;
};
export type PaginatedDogByBreedListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogByBreedList[];
};
export type PaginatedDogByBreedListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogByBreedListRead[];
};
export type DogList = {
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
};
export type DogListRead = {
  id: number;
  name: string;
  internationalName: string;
  birthDate: string;
  color: string;
  description?: string | null;
  breed: BreedBriefRead;
  status: CodeLabel;
  sex: CodeLabel;
  potential: CodeLabel;
  photos: DogPhotosRead[];
  documents: DogDocumentsRead[];
  parents: {
    mother?: {
      id?: string;
      name?: string;
    };
    father?: {
      id?: string;
      name?: string;
    };
  };
};
export type PaginatedDogListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogList[];
};
export type PaginatedDogListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogListRead[];
};
export const {
  useV1BreedsDogsListQuery,
  useV1BreedsDogsRetrieveQuery,
  useV1DogsListQuery,
  useV1DogsRetrieveQuery,
} = injectedRtkApi;
