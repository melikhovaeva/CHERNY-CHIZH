import { baseApi as api } from "../base-api";
export const addTagTypes = ["v1"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1NurseryDogsList: build.query<
        V1NurseryDogsListApiResponse,
        V1NurseryDogsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/`,
          params: {
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["v1"],
      }),
      v1NurseryDogsCreate: build.mutation<
        V1NurseryDogsCreateApiResponse,
        V1NurseryDogsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/`,
          method: "POST",
          body: queryArg.dogAdminWrite,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsRetrieve: build.query<
        V1NurseryDogsRetrieveApiResponse,
        V1NurseryDogsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/nursery/dogs/${queryArg.id}/` }),
        providesTags: ["v1"],
      }),
      v1NurseryDogsUpdate: build.mutation<
        V1NurseryDogsUpdateApiResponse,
        V1NurseryDogsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/`,
          method: "PUT",
          body: queryArg.dogAdminWrite,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsPartialUpdate: build.mutation<
        V1NurseryDogsPartialUpdateApiResponse,
        V1NurseryDogsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedDogAdminWrite,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsDestroy: build.mutation<
        V1NurseryDogsDestroyApiResponse,
        V1NurseryDogsDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsDocumentsDestroy: build.mutation<
        V1NurseryDogsDocumentsDestroyApiResponse,
        V1NurseryDogsDocumentsDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/documents/${queryArg.docId}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsPhotosDestroy: build.mutation<
        V1NurseryDogsPhotosDestroyApiResponse,
        V1NurseryDogsPhotosDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/photos/${queryArg.photoId}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsPhotosSetMainCreate: build.mutation<
        V1NurseryDogsPhotosSetMainCreateApiResponse,
        V1NurseryDogsPhotosSetMainCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/photos/${queryArg.photoId}/set-main/`,
          method: "POST",
          body: queryArg.dogList,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsPublishCreate: build.mutation<
        V1NurseryDogsPublishCreateApiResponse,
        V1NurseryDogsPublishCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/publish/`,
          method: "POST",
          body: queryArg.dogList,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsUnpublishCreate: build.mutation<
        V1NurseryDogsUnpublishCreateApiResponse,
        V1NurseryDogsUnpublishCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/unpublish/`,
          method: "POST",
          body: queryArg.dogList,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsUploadDocumentCreate: build.mutation<
        V1NurseryDogsUploadDocumentCreateApiResponse,
        V1NurseryDogsUploadDocumentCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/upload-document/`,
          method: "POST",
          body: queryArg.dogList,
        }),
        invalidatesTags: ["v1"],
      }),
      v1NurseryDogsUploadPhotoCreate: build.mutation<
        V1NurseryDogsUploadPhotoCreateApiResponse,
        V1NurseryDogsUploadPhotoCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/nursery/dogs/${queryArg.id}/upload-photo/`,
          method: "POST",
          body: queryArg.dogList,
        }),
        invalidatesTags: ["v1"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1NurseryDogsListApiResponse =
  /** status 200  */ PaginatedDogListListRead;
export type V1NurseryDogsListApiArg = {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1NurseryDogsCreateApiResponse = /** status 201  */ DogAdminWrite;
export type V1NurseryDogsCreateApiArg = {
  dogAdminWrite: DogAdminWrite;
};
export type V1NurseryDogsRetrieveApiResponse = /** status 200  */ DogListRead;
export type V1NurseryDogsRetrieveApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
};
export type V1NurseryDogsUpdateApiResponse = /** status 200  */ DogAdminWrite;
export type V1NurseryDogsUpdateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  dogAdminWrite: DogAdminWrite;
};
export type V1NurseryDogsPartialUpdateApiResponse =
  /** status 200  */ DogAdminWrite;
export type V1NurseryDogsPartialUpdateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  patchedDogAdminWrite: PatchedDogAdminWrite;
};
export type V1NurseryDogsDestroyApiResponse = unknown;
export type V1NurseryDogsDestroyApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
};
export type V1NurseryDogsDocumentsDestroyApiResponse = unknown;
export type V1NurseryDogsDocumentsDestroyApiArg = {
  docId: string;
  /** A unique integer value identifying this Собака. */
  id: number;
};
export type V1NurseryDogsPhotosDestroyApiResponse = unknown;
export type V1NurseryDogsPhotosDestroyApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  photoId: string;
};
export type V1NurseryDogsPhotosSetMainCreateApiResponse =
  /** status 200  */ DogListRead;
export type V1NurseryDogsPhotosSetMainCreateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  photoId: string;
  dogList: DogList;
};
export type V1NurseryDogsPublishCreateApiResponse =
  /** status 200  */ DogListRead;
export type V1NurseryDogsPublishCreateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  dogList: DogList;
};
export type V1NurseryDogsUnpublishCreateApiResponse =
  /** status 200  */ DogListRead;
export type V1NurseryDogsUnpublishCreateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  dogList: DogList;
};
export type V1NurseryDogsUploadDocumentCreateApiResponse =
  /** status 200  */ DogListRead;
export type V1NurseryDogsUploadDocumentCreateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  dogList: DogList;
};
export type V1NurseryDogsUploadPhotoCreateApiResponse =
  /** status 200  */ DogListRead;
export type V1NurseryDogsUploadPhotoCreateApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
  dogList: DogList;
};
export type AgeGroupEnum = "puppy" | "adult";
export type DogList = {
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
  ageGroup?: AgeGroupEnum;
  isPublished?: boolean;
};
export type BreedBrief = {
  name: string;
  fullName: string;
};
export type BreedBriefRead = {
  id: number;
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
  isMain?: boolean;
};
export type DogPhotosRead = {
  id: number;
  url: string;
  isMain?: boolean;
};
export type DocumentTypeEnum = "puppy_card" | "vet_passport";
export type DogDocuments = {
  name: string;
  documentType?: DocumentTypeEnum;
};
export type DogDocumentsRead = {
  id: number;
  name: string;
  documentType?: DocumentTypeEnum;
  url: string;
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
  ageGroup?: AgeGroupEnum;
  isPublished?: boolean;
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
  createdAt: string;
  updatedAt: string;
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
export type SexEnum = "male" | "female";
export type PotentialEnum = "pet" | "show" | "breeding";
export type DogAdminWriteStatusEnum = "on_sale" | "booked" | "sold";
export type DogAdminWrite = {
  name: string;
  internationalName?: string;
  breed: number;
  sex: SexEnum;
  birthDate: string;
  color: string;
  potential: PotentialEnum;
  ageGroup?: AgeGroupEnum;
  description?: string | null;
  status: DogAdminWriteStatusEnum;
  isPublished?: boolean;
  mother?: number | null;
  father?: number | null;
};
export type PatchedDogAdminWrite = {
  name?: string;
  internationalName?: string;
  breed?: number;
  sex?: SexEnum;
  birthDate?: string;
  color?: string;
  potential?: PotentialEnum;
  ageGroup?: AgeGroupEnum;
  description?: string | null;
  status?: DogAdminWriteStatusEnum;
  isPublished?: boolean;
  mother?: number | null;
  father?: number | null;
};
export const {
  useV1NurseryDogsListQuery,
  useV1NurseryDogsCreateMutation,
  useV1NurseryDogsRetrieveQuery,
  useV1NurseryDogsUpdateMutation,
  useV1NurseryDogsPartialUpdateMutation,
  useV1NurseryDogsDestroyMutation,
  useV1NurseryDogsDocumentsDestroyMutation,
  useV1NurseryDogsPhotosDestroyMutation,
  useV1NurseryDogsPhotosSetMainCreateMutation,
  useV1NurseryDogsPublishCreateMutation,
  useV1NurseryDogsUnpublishCreateMutation,
  useV1NurseryDogsUploadDocumentCreateMutation,
  useV1NurseryDogsUploadPhotoCreateMutation,
} = injectedRtkApi;
