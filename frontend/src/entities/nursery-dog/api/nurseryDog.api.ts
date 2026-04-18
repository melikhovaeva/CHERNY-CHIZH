import { baseApi } from '@/shared/api/base-api';
import {
  enhancedApi as nurseryGeneratedApi,
  type DogListRead,
  type PaginatedDogListListRead,
} from '@/shared/api/generated/nursery.generated';

nurseryGeneratedApi.enhanceEndpoints({
  endpoints: {
    v1NurseryDogsList: { providesTags: ['NurseryDogs'] },
    v1NurseryDogsRetrieve: { providesTags: ['NurseryDogs'] },
    v1NurseryDogsCreate: { invalidatesTags: ['NurseryDogs'] },
    v1NurseryDogsUpdate: { invalidatesTags: ['NurseryDogs'] },
    v1NurseryDogsPartialUpdate: { invalidatesTags: ['NurseryDogs'] },
    v1NurseryDogsDestroy: { invalidatesTags: ['NurseryDogs'] },
    v1NurseryDogsDocumentsDestroy: { invalidatesTags: ['NurseryDogs'] },
    v1NurseryDogsPhotosDestroy: { invalidatesTags: ['NurseryDogs'] },
  },
});

export {
  useV1NurseryDogsListQuery,
  useV1NurseryDogsRetrieveQuery,
  useV1NurseryDogsCreateMutation,
  useV1NurseryDogsUpdateMutation,
  useV1NurseryDogsPartialUpdateMutation,
  useV1NurseryDogsDestroyMutation,
  useV1NurseryDogsDocumentsDestroyMutation,
  useV1NurseryDogsPhotosDestroyMutation,
} from '@/shared/api/generated/nursery.generated';

export interface NurseryDogsListParams {
  limit?: number;
  offset?: number;
  ageGroup?: string;
  breedId?: string;
  search?: string;
}

const nurseryFilteredApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    nurseryDogsFilteredList: build.query<
      PaginatedDogListListRead,
      NurseryDogsListParams
    >({
      query: ({ limit = 20, offset = 0, ageGroup, breedId, search }) => ({
        url: '/api/v1/nursery/dogs/',
        params: {
          limit,
          offset,
          ...(ageGroup ? { age_group: ageGroup } : {}),
          ...(breedId ? { breed: breedId } : {}),
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ['NurseryDogs'],
    }),
  }),
  overrideExisting: false,
});

export const { useNurseryDogsFilteredListQuery } = nurseryFilteredApi;

const nurseryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    nurserySetMainPhoto: build.mutation<
      { id: number; url: string; isMain: boolean },
      { id: number; photoId: string }
    >({
      query: ({ id, photoId }) => ({
        url: `/api/v1/nursery/dogs/${id}/photos/${photoId}/set-main/`,
        method: 'POST',
      }),
      invalidatesTags: ['NurseryDogs'],
    }),
    nurseryUploadPhoto: build.mutation<
      { id: number; url: string; isMain: boolean },
      { id: number; photo: File; isMain?: boolean }
    >({
      query: ({ id, photo, isMain }) => {
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('is_main', String(isMain ?? false));
        return {
          url: `/api/v1/nursery/dogs/${id}/upload-photo/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['NurseryDogs'],
    }),
    nurseryUploadDocument: build.mutation<
      { id: number; name: string; documentType: string; url: string },
      { id: number; file: File; documentType: string }
    >({
      query: ({ id, file, documentType }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', documentType);
        return {
          url: `/api/v1/nursery/dogs/${id}/upload-document/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['NurseryDogs'],
    }),
    nurseryPublish: build.mutation<DogListRead, { id: number }>({
      query: ({ id }) => ({
        url: `/api/v1/nursery/dogs/${id}/publish/`,
        method: 'POST',
      }),
      invalidatesTags: ['NurseryDogs'],
    }),
    nurseryUnpublish: build.mutation<DogListRead, { id: number }>({
      query: ({ id }) => ({
        url: `/api/v1/nursery/dogs/${id}/unpublish/`,
        method: 'POST',
      }),
      invalidatesTags: ['NurseryDogs'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useNurserySetMainPhotoMutation,
  useNurseryUploadPhotoMutation,
  useNurseryUploadDocumentMutation,
  useNurseryPublishMutation,
  useNurseryUnpublishMutation,
} = nurseryApi;
